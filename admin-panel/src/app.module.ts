import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AdminModule } from './admin/admin.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    // TypeOrmModule.forRoot(databaseConfig),
    AdminModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AppModule {}
