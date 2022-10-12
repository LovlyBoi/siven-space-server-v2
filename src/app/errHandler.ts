import { Context } from "koa";
import { ErrorType } from "../utils/useErrorEmit";
import { logger } from "../utils/log";

// 自己emit的错误，在 utils/useEmit 可以提交
export function customErrorHandler(
  errorType: ErrorType,
  ctx: Context,
  errorForLog: Error,
  msg: string | null
) {
  // 如果没有msg，就走koa默认的body
  // 所以如果想要提交自定义的信息到客户端，需要传入第四个参数
  msg && (ctx.body = msg);
  ctx.status = errorType;
  logger.error({
    errorStack: errorForLog.stack,
    errorMessage: errorForLog.message,
  });
}

// 默认的错误处理
export function defaultErrorHandler(error: Error, ctx?: Context) {
  if (ctx) {
    ctx.status = 500;
  }
  logger.error({
    errorStack: error.stack,
    errorMessage: error.message,
    isDefaultErrorhandler: true,
  });
}
