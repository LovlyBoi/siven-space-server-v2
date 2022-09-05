import "./config";
import Koa from "koa";
import CORS from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { blogsRouter } from "../router/blogs.router";
import { log } from "../utils/log";
import { network as ip } from "../utils/getIp";
import './database'

const app = new Koa();

app.use(CORS());

app.use(bodyParser());

app.use(blogsRouter.routes());
app.use(blogsRouter.allowedMethods());

export const startLog = () => {
  log("yellow", `\n  ${process.env.APP_NAME}`);
  log("white", " is running in\n");
  log("green", "    ➜  ");
  log("white", "local: ");
  log("blue", `http://${ip.local}:${process.env.APP_PORT}\n`);
  log("green", "    ➜  ");
  log("white", "network: ");
  log("blue", `http://${ip.network}:${process.env.APP_PORT}\n\n`);
}

export default app;
