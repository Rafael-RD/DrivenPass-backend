import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserLocals } from '../decorators';
import { User } from '@prisma/client';
import { EraseUserDto } from './dto/erase-user.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('erase')
  @HttpCode(200)
  erase(@Body() eraseUserDto: EraseUserDto, @UserLocals() user: User) {
    return this.userService.deleteUser(eraseUserDto, user);
  }
}
