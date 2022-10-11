import "./config";
import "./database";
import Koa from "koa";
import KoaRouter from "koa-router";
import CORS from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { blogsRouter } from "../router/blogs.router";
import { uploadRouter } from "../router/uploader.router";
import { imageRouter } from "../router/image.router";
import { customErrorHandler, defaultErrorHandler } from "./errHandler";
import { colorfulLog } from "../utils/colorfulLog";
import { network as ip } from "../utils/getIp";
import { cacheInit, cacheRootPath } from "../utils/cache";
import { logger } from "../utils/log";
import { initDataBase } from "../dao/init.dao";

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
logger.info('缓存初始化完成，根路径为：' + cacheRootPath);

// 初始化数据库
initDataBase();

// 解决跨域
const whiteList = [
  "http://192.168.31.17",
  "https://192.168.31.17",
  "http://127.0.0.1",
  "https://127.0.0.1",
  "http://localhost",
  "https://localhost",
  "http://123.57.238.32",
  "https://123.57.238.32",
  "http://siven.cc",
  "https://siven.cc",
];

app.use(
  CORS({
    origin: (ctx) => {
      const origin = ctx.headers.origin;
      for (const whiteOrigin of whiteList) {
        if (origin?.startsWith(whiteOrigin)) {
          return origin;
        }
      }
      return "";
    },
  })
);

// 解析请求体
app.use(bodyParser());

// 路由
useRouter(app, [blogsRouter, uploadRouter, imageRouter]);

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
  logger.log("info", `服务启动于${process.env.APP_PORT}端口`);
};

export default app;
