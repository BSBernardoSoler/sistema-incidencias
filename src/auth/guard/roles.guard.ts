import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>('roles', context.getHandler());
    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return user.role.some((role: { nombre: string }) => role.nombre === requiredRole); // Verificar rol
  }
}