import { Middleware } from "koa";
import { trackerService } from "../service/tracker.service";
import { ErrorType, useEmit } from "../utils/useErrorEmit";

const {
  createVisit: createVisitService,
  createVisitor: createVisitorService,
  getPv: getPvService,
} = trackerService;

class TrackerController {
  // 创建访客
  createVisitor: Middleware = async (ctx, next) => {
    const ip = ctx.request.ip;
    try {
      ctx.body = await createVisitorService(ip);
    } catch (e) {
      console.log(e);
    }
    await next();
  };
  createVisit: Middleware = async (ctx, next) => {
    
  }
  // 获取pv
  getPv: Middleware = async (ctx, next) => {
    const start = ctx.request.query.start as string | undefined;
    const end = ctx.request.query.end as string | undefined;
    if (!start) {
      return useEmit(
        ErrorType.BadRequest,
        ctx,
        new Error("请求未携带start参数"),
        "请求未携带start参数"
      );
    }
    try {
      ctx.body = await getPvService(
        new Date(start),
        end ? new Date(end) : new Date()
      );
    } catch (e) {
      return useEmit(
        ErrorType.InternalServerError,
        ctx,
        e as Error,
        "获取pv错误"
      );
    }
    await next();
  };
}

export const trackerController = new TrackerController();
