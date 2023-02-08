import cluster from "cluster";
import path from 'path';
import { cpus } from "os";

cluster.setupPrimary({
  // exec: "./worker.ts",
  exec: path.resolve(__dirname, "./worker.ts"),
});

const cpuNum = cpus().length - 1;
// 进程数
// const workerNum = cpuNum - 1 < 1 ? 1 : cpuNum - 1;
const workerNum = 2;

const startWorkerProcess = (workerNum: number) => {
  for (let i = 0; i < workerNum; i++) {
    cluster.fork();
  }
};

startWorkerProcess(workerNum);
