import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(bd: CreateUserDto): Promise<User> {
    console.log('Полученные данные:', bd);
    const newUser = this.usersRepository.create(bd);
    return await this.usersRepository.save(newUser);
  }

  async getAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
