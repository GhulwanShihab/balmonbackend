import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt.guards';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(AuthService) private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; 
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    try {
      const userRole = await this.authService.getUserRole(user.userId);
      if (!roles.includes(userRole)) {
        console.error(`User with role '${userRole}' is not authorized to access this resource.`);
        return false;
      }
      return true; 
    } catch (error) {
      console.error(`Error checking roles: ${error.message}`);
      return false; 
    }
  }
}