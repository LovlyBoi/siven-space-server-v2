import type { Middleware } from "koa";
import { token } from "../utils/token";
import { ErrorType, useEmit } from "../utils/useErrorEmit";
import { authService } from "../service/auth.service";

const { getUserInfo } = authService;

export const checkAccessToken: Middleware = async (ctx, next) => {
  const accessToken = ctx.headers.authorization;
  if (!accessToken) {
    return useEmit(
      ErrorType.Unauthorized,
      ctx,
      Error("用户未携带access_token"),
      "access_token is required"
    );
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
  } else {
    ctx.query = Object.assign(ctx.query, { _userId: result.payload?.aud });
  }
  await next();
};

export const checkManager: Middleware = async (ctx, next) => {
  const userId = (ctx.query._userId as string) || "";
  if (!userId) {
    return useEmit(
      ErrorType.BadRequest,
      ctx,
      Error(""),
      "Cannot get 'authorId' from access_token."
    );
  }
  const { isSuccess, userInfo } = await getUserInfo(userId);
  if (!isSuccess) {
    return useEmit(ErrorType.Forbidden, ctx, Error(""), "No Permission.");
  }
  if (!userInfo) {
    return useEmit(ErrorType.Forbidden, ctx, Error(""), "No Permission.");
  }
  if (userInfo.role !== 2 && userInfo.role !== 3) {
    return useEmit(ErrorType.Forbidden, ctx, Error(""), "No Permission.");
  }
  await next()
};
