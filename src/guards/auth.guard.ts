import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { UnauthorizedException } from "../errors";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly AuthService: AuthService,
    private readonly UserService: UserService
  ) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const authHeader = request.headers.authorization;

    try {
      const data = this.AuthService.checkToken((authHeader ?? "").split(" ")[1]);
      const user = await this.UserService.findUserByEmail(data.email);
      response.locals.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
