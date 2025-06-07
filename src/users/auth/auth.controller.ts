import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  SerializeOptions,
  UseInterceptors,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from '../login.dto';
import { LoginResponse } from '../login.response';
import { UserService } from '../user/user.service';
import { AuthRequest } from '../auth.request';
import { AuthGuard } from '../auth.guard';
import { Public } from '../decorators/public.decoractor';
import { AdminResponse } from '../admin.response';
import { Role } from '../role.enum';
import { Roles } from '../decorators/roles.decoractors';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return new LoginResponse({ accessToken });
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async profile(@Request() request: AuthRequest): Promise<User> {
    const user = await this.usersService.findOne(request.user.sub);

    if (user) {
      return user;
    }

    throw new NotFoundException();
  }

  @Get('admin') //auth/admin
  @Roles(Role.ADMIN)
  async adminOnlyt() {
    return new AdminResponse({ message: 'This is for admins only!' });
  }
}
