import KoaRouter from "koa-router";
import { trackerController } from "../controller/tracker.controller";

const { createVisitor, getPv } = trackerController;

const trackerRouter = new KoaRouter({ prefix: "/tracker" });

trackerRouter.get("/getId", createVisitor);

trackerRouter.get("/getPv", getPv);

export { trackerRouter };
