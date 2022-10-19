import KoaRouter from "koa-router";
import { trackerController } from "../controller/tracker.controller";

const { createVisitor } = trackerController;

const trackerRouter = new KoaRouter({ prefix: "/tracker" });

trackerRouter.get("/getId", createVisitor);

export { trackerRouter };
