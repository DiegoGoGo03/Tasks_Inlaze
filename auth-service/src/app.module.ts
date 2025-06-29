import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '784512',
      database: 'auth_db',
      entities: [User],
      synchronize: true, // Desactiva en producción
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
