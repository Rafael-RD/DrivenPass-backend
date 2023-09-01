import { HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '../errors';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {

  private readonly TOKEN_EXPIRES_IN = "24h";
  private readonly TOKEN_ISSUER = "nestjs-auth";
  private readonly TOKEN_AUDIENCE = "nestjs-auth";

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) { }

  async signup(signupDto: SignupDto) {
    return await this.userService.createUser(signupDto as CreateUserDto);
  }


  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    try {
      const user = await this.userService.findUserByEmail(email);
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) throw new UnauthorizedException('Invalid credentials');

      return this.createToken(user);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) throw new UnauthorizedException('Invalid credentials');
      if (error.status === HttpStatus.UNAUTHORIZED) throw new UnauthorizedException('Invalid credentials');

      console.error(error);
    }
  }

  createToken(user: User) {
    const payload = { email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.TOKEN_EXPIRES_IN,
      subject: user.id.toString(),
      issuer: this.TOKEN_ISSUER,
      audience: this.TOKEN_AUDIENCE
    });

    return { accessToken };
  }

  checkToken(token: string) {
    const data = this.jwtService.verify(token, {
      audience: this.TOKEN_AUDIENCE,
      issuer: this.TOKEN_ISSUER,
    });

    return data;
  }
}
