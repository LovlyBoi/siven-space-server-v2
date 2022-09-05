import "./config";
import "./database";
import Koa from "koa";
import KoaRouter from "koa-router";
import CORS from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { blogsRouter } from "../router/blogs.router";
import { log } from "../utils/log";
import { network as ip } from "../utils/getIp";

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

app.use(CORS());

app.use(bodyParser());

useRouter(app, [blogsRouter]);

export const startLog = () => {
  log("yellow", `\n  ${process.env.APP_NAME}`);
  log("white", " is running in\n");
  log("green", "    ➜  ");
  log("white", "local: ");
  log("blue", `http://${ip.local}:${process.env.APP_PORT}\n`);
  log("green", "    ➜  ");
  log("white", "network: ");
  log("blue", `http://${ip.network}:${process.env.APP_PORT}\n\n`);
};

export default app;
