import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('AdminRoleGuard - User from request:', user);

    if (!user || !user.role) {
      throw new UnauthorizedException('User not authenticated');
    }

    return user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
  }
}
