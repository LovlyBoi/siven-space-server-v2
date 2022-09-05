import { Context } from "koa";

export enum ErrorType {
  // 客户端错误
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  IamTeapot = 418,
  // 服务器错误
  InternalServerError = 500,
}

export function useEmit(
  errType: ErrorType,
  context: Context,
  error: Error,
  errorMessage?: string
) {
  errorMessage = errorMessage || error.message;
  context.app.emit("custom-error", errType, context, error, errorMessage);
}
