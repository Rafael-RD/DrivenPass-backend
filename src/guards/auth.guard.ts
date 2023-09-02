import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { UnauthorizedException } from "../errors";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly AuthService: AuthService,
    private readonly UserService: UserService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = this.extractTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException("Invalid token");
    }


    try {
      const data = this.AuthService.checkToken(token);
      const user = await this.UserService.findUserByEmail(data.email);
      response.locals.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }

  extractTokenFromRequest(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
