import { Context } from "koa";
import { ErrorType } from "../utils/useErrorEmit";
import Log from "../utils/log";

// 自己emit的错误，在 utils/useEmit 可以提交
export function customErrorHandler(
  errorType: ErrorType,
  ctx: Context,
  error: Error,
  msg?: string
) {
  ctx.body = msg;
  ctx.status = errorType;
  Log.error(error);
}

// 默认的错误处理
export function defaultErrorHandler(err: Error, ctx?: Context) {
  if (ctx) {
    ctx.status = 500;
  }
  Log.error(err.toString());
}
