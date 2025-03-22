import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Render,
  Param,
  Body,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  Redirect,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminGuard } from './guards/admin.guards';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/user.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UsersService) {}

  // Незащищённый маршрут: страница регистрации
  @Get('register')
  @Render('admin/register')
  showRegisterForm() {
    return { error: null, layout: 'layouts/auth' }; // Показываем форму без ошибки
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
  dashboard(@Req() req: Request) {
    return {
      title: 'Admin Dashboard',
      layout: 'layouts/layout',
      currentPath: req.url,
    };
  }
  @Get('users')
  @UseGuards(AdminGuard)
  @Render('admin/users')
  async users(@Req() req: Request, @Query() query: any) {
    let alert: any = null;

    if (query.success === 'true') {
      alert = { type: 'success', message: 'Пользователь успешно создан!' };
    } else if (query.error === 'true') {
      alert = { type: 'error', message: 'Ошибка при создании пользователя!' };
    }

    const users = await this.userService.getAll();
    return {
      title: 'Users list',
      layout: 'layouts/layout',
      users,
      currentPath: req.url,
      alert,
    };
  }

  @Get('user/:id')
  @UseGuards(AdminGuard)
  @Render('admin/user')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findOne(Number(id));
    return {
      title: `User ${user.id}`,
      layout: 'layouts/layout',
      user,
    };
  }
  @Get('users/create')
  @UseGuards(AdminGuard)
  @Render('admin/create_user')
  async createUserPage() {
    return { title: 'Создать пользователя', layout: 'layouts/layout' };
  }
  @Post('user/create')
  async createUser(@Res() res: Response, @Body() bd: CreateUserDto) {
    try {
      await this.userService.createUser(bd);
      return res.redirect('/admin/users?success=true');
    } catch (error) {
      return res.redirect('/admin/users?error=true');
    }
  }
  @Post('user/:id/edit')
  async editUser(
    @Param('id') id: string,
    @Body() body: any,
    @Res() response: Response,
  ) {
    try {
      const updatedUser = await this.userService.update(Number(id), body);
      return response.redirect(`/admin/users`);
    } catch (error) {
      return response.render('admin/user', {
        error: 'Failed to update user. Please try again.',
        user: await this.userService.findOne(Number(id)),
        layout: 'layouts/layout',
      });
    }
  }
  @Delete('user/:id/delete')
  async deleteUser(@Param('id') id: string) {
    const deleted = await this.userService.deleteUser(Number(id));
    if (!deleted) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    return { message: 'Пользователь удалён' };
  }

  // Защищённый маршрут: выход из админ-панели
  @Get('logout')
  @UseGuards(AdminGuard) // Guard защищает этот маршрут
  logout(@Res() response: Response) {
    response.clearCookie('admin-key'); // Удаляем куки
    return response.redirect('/admin/register');
  }
}
