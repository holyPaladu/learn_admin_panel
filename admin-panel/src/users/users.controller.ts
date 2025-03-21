import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/user.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь создан', type: User })
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.createUser(user);
  }

  @Get()
  async getAll() {
    return this.usersService.getAll();
  }
}
