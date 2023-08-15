import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const SECRET_TOKEN = process.env.JWT_SECRET;
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', ''); // Remove o prefixo 'Bearer '

    if (!token) {
      return false;
    }

    try {
      const decoded = jwt.verify(token, SECRET_TOKEN); // verifica se o token é válido e dentro do prazo de validade
      request.user = decoded; // Define o usuário decodificado no objeto de solicitação
      return true;
    } catch (error) {
      return false;
    }
  }
}
