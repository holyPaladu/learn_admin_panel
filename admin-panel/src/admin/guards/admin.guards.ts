import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // console.log('Cookies:', request.cookies); // ⬅️ Проверяем куки

    // Получаем ключ из кук
    const userKey = request.cookies?.['admin-key'];
    const correctKey = process.env.ADMIN_KEY;

    if (userKey === correctKey) {
      return true;
    }

    response.redirect('/admin/register');
    return false;
  }
}
