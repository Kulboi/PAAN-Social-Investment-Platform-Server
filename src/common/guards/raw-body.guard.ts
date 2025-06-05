import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RawBodyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { rawBody?: Buffer }>();
    return !!request.rawBody;
  }
}