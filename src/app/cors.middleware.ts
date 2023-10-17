import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Adicione os cabeçalhos necessários aqui
    res.header('Access-Control-Allow-Origin', '*'); // * para todos ou http://localhost:3000 para um domínio específico
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    next();
  }
}
