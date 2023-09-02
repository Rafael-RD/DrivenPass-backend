import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { NotFoundException } from "../errors";
import { User } from "@prisma/client";

export const UserLocals = createParamDecorator((data: string, context: ExecutionContext) => {
  const response = context.switchToHttp().getResponse();
  if (!response.locals.user) throw new NotFoundException("User not found");

  return response.locals.user as User;
});
