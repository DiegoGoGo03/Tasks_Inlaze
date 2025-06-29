// src/users/users.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'member')
  getProfile(@Request() req) {
    return req.user;
  }
}
