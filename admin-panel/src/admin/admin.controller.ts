import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Render,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminGuard } from './guards/admin.guards';

@Controller('admin')
export class AdminController {
  // Незащищённый маршрут: страница регистрации
  @Get('register')
  @Render('admin/register')
  showRegisterForm() {
    return { error: null }; // Показываем форму без ошибки
  }

  // Незащищённый маршрут: обработка формы регистрации
  @Post('register')
  register(@Req() request: Request, @Res() response: Response) {
    const adminKey = request.body['admin-key'];
    const correctKey = process.env.ADMIN_KEY; // Ключ из .env

    if (adminKey === correctKey) {
      // Устанавливаем ключ в куки
      response.cookie('admin-key', adminKey, { httpOnly: true });
      return response.redirect('/admin/dashboard');
    } else {
      // Показываем форму с ошибкой
      return response.render('admin/register', {
        error: 'Invalid key. Please try again.',
      });
    }
  }

  // Защищённый маршрут: админ-панель
  @Get('dashboard')
  @UseGuards(AdminGuard)
  @Render('admin/dashboard')
  dashboard() {
    return { title: 'Admin ', users: [{ name: 'Auez', role: 'client' }] };
  }

  // Защищённый маршрут: выход из админ-панели
  @Get('logout')
  @UseGuards(AdminGuard) // Guard защищает этот маршрут
  logout(@Res() response: Response) {
    response.clearCookie('admin-key'); // Удаляем куки
    return response.redirect('/admin/register');
  }
}
