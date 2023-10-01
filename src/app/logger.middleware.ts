import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        winston.format.printf(({ timestamp, level, message, ...metadata }) => {
          let logMessage = `${timestamp} [${level.toUpperCase()}]`;

          if (metadata.status) {
            logMessage += ` route {${metadata.route}, ${metadata.method}} status ${metadata.status}`;
          }

          // Adicione a propriedade 'message' com a mensagem desejada
          logMessage += ` ${metadata.message || ''}`;

          // Verifique se é um erro e inclua o payload apenas se não for um erro
          if (metadata.status >= 400 && metadata.payload) {
            logMessage += `\n${JSON.stringify(metadata.payload, null, 2)}`;
          }

          return logMessage;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // Remova esta linha para não criar o arquivo de log combinado
      ],
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, params } = req;
    const userAgent = req.get('user-agent') || '';
    const timestamp = new Date().toISOString();

    res.on('finish', () => {
      const statusCode = res.statusCode;

      const logData: {
        timestamp: string;
        method: string;
        originalUrl: string;
        userAgent: string;
        body: any;
        query: any;
        params: any;
        route: string;
        status: number;
        message: string;
        payload?: any; // Propriedade payload como opcional
      } = {
        timestamp,
        method,
        originalUrl,
        userAgent,
        body,
        query,
        params,
        route: originalUrl,
        status: statusCode,
        message: null, // Defina a mensagem desejada aqui
      };

      if (statusCode >= 400 && body && body.message) {
        logData.message = body.message.join('\n');
      }

      if (statusCode === 200 || statusCode === 201) {
        this.logger.info(
          'route {' + originalUrl + ', ' + method + '} status ' + statusCode,
          logData,
        );
      } else {
        this.logger.error(
          'route {' + originalUrl + ', ' + method + '} status ' + statusCode,
          logData,
        );
      }
    });

    next();
  }
}
