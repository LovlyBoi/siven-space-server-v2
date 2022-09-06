import "./config";
import "./database";
import Koa from "koa";
import KoaRouter from "koa-router";
import CORS from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { blogsRouter } from "../router/blogs.router";
import { customErrorHandler, defaultErrorHandler } from "./errHandler";
import { colorfulLog } from "../utils/colorfulLog";
import { network as ip } from "../utils/getIp";
import { cacheInit } from '../utils/cache';

function useRouter(app: Koa, routers: KoaRouter | KoaRouter[]) {
  if (Array.isArray(routers)) {
    for (const router of routers) {
      app.use(router.routes());
      app.use(router.allowedMethods());
    }
  } else {
    app.use(routers.routes());
    app.use(routers.allowedMethods());
  }
}

const app = new Koa();

// 初始化缓存目录
cacheInit();

// 解决跨域
app.use(CORS());

// 解析请求体
app.use(bodyParser());

// 路由
useRouter(app, [blogsRouter]);

// 错误处理
app.on("custom-error", customErrorHandler);
app.on("error", defaultErrorHandler);

// 启动打印
export const startLog = () => {
  colorfulLog("yellow", `\n  ${process.env.APP_NAME}`);
  colorfulLog("white", " is running in\n");
  colorfulLog("green", "    ➜  ");
  colorfulLog("white", "local: ");
  colorfulLog("blue", `http://${ip.local}:${process.env.APP_PORT}\n`);
  colorfulLog("green", "    ➜  ");
  colorfulLog("white", "network: ");
  colorfulLog("blue", `http://${ip.network}:${process.env.APP_PORT}\n\n`);
};

export default app;
