import cluster from "cluster";
import process from "process";
import app, { startLog } from "./src/app";
import { logger } from "./src/utils/log";

if (cluster.isWorker) {
  logger.info(`工作进程 ${cluster.worker?.id} 启动, pid: ${process.pid}`);
}

const handleMessage = (msg: any) => {
  if (msg.type === "INITIAL_RECOMMAND_MATRIX") {
    const { matrix, userArr, itemArr } = msg;
  }
};

process.on("message", handleMessage);

app.listen(process.env.APP_PORT, startLog);
