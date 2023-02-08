import cluster from "cluster";
import { pid } from "process";
import app, { startLog } from "./src/app";
import { logger } from "./src/utils/log";

if (cluster.isWorker) {
  logger.info(`工作进程 ${cluster.worker?.id} 启动, pid: ${pid}`);
}

app.listen(process.env.APP_PORT, startLog);
