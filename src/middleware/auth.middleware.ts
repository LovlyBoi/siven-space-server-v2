import type { Middleware } from "koa";
import { token } from "../utils/token";
import { ErrorType, useEmit } from "../utils/useErrorEmit";

export const checkAccessToken: Middleware = async (ctx, next) => {
  const accessToken = ctx.headers.authorization;
  if (!accessToken) {
    return useEmit(ErrorType.Unauthorized, ctx, Error("用户未携带access_token"), 'access_token is required');
  }
  const result = token.verifyToken(accessToken);
  console.log(result);
  if (!result.isOk) {
    return useEmit(
      ErrorType.Unauthorized,
      ctx,
      result.error || Error("Token 不合格"),
      result.error?.message || "Token 不合格"
    );
  }
  await next();
};
