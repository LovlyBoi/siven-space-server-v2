import { Middleware } from "koa";
import { trackerService } from "../service/tracker.service";

const { createVisit: createVisitService, createVisitor: createVisitorService } =
  trackerService;

class TrackerController {
  // 创建访客
  createVisitor: Middleware = async (ctx, next) => {
    const ip = ctx.request.ip;
    try {
      ctx.body = await createVisitorService(ip);
    } catch (e) {
      console.log(e)
    }
    await next();
  };
}

export const trackerController = new TrackerController();
