import { PasswordService } from './../password/password.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passWordService: PasswordService,
  ) {}

  public async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userService.createUser(createUserDto);

    return user;
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findOneByEmail(email);

    if (
      !user ||
      !(await this.passWordService.verify(password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: User): string {
    const playload = { sub: user.id, name: user.name, roles: user.roles };
    return this.jwtService.sign(playload);
  }
}
