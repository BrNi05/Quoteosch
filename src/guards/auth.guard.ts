import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

const PROTECTED_METHODS = ['POST', 'PUT', 'DELETE'];

@Injectable()
export class BearerAuthGuard implements CanActivate {
  private readonly logger = new Logger(BearerAuthGuard.name);

  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method.toUpperCase();

    if (!PROTECTED_METHODS.includes(method)) {
      return true;
    }

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      this.logger.warn('Access attempt without Authorization header');
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || token !== this.config.get('API_KEY')) {
      this.logger.warn(`Unauthorized access attempt with token: ${token}`);
      throw new UnauthorizedException('Invalid API token. Action logged.');
    }

    return true;
  }
}
