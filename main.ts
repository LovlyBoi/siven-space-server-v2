// import cluster from "cluster";
// import path from "path";
// import { cpus } from "os";
// // import { matrix, userArr, itemArr } from "./sharedData";

// cluster.setupPrimary({
//   exec: path.resolve(__dirname, "./worker.ts"),
// });

// const cpuNum = cpus().length - 1;
// // 进程数
// // const workerNum = cpuNum - 1 < 1 ? 1 : cpuNum - 1;
// const workerNum = 1;

// const startWorkerProcess = (workerNum: number) => {
//   for (let i = 0; i < workerNum; i++) {
//     const w = cluster.fork();
//   }
// };

// const handleMessage = (msg: any) => {
//   console.log("main recive:", msg);
// };

// // cluster.on("online", (w) => {
// //   w.on("message", handleMessage);
// //   w.send({
// //     type: "INITIAL_RECOMMAND_MATRIX",
// //     matrix,
// //     itemArr,
// //     userArr,
// //   });
// // });

// startWorkerProcess(workerNum);


import app, { startLog } from "./src/app";

app.listen(process.env.APP_PORT, startLog);