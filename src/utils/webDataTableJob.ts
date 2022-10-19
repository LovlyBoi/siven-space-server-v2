import schedule from "node-schedule";
import { createTodayWebDataTable } from "../dao/tracker.dao";
import { logger } from "./log";

function startWebDataTableJob() {
  logger.info("启动流量数据库建表定时任务");
  // 每天零点建两张表
  return schedule.scheduleJob("0 0 0 * * *", () => {
    createTodayWebDataTable()
      .then(() => {
        logger.info("流量数据库每日建表成功 " + new Date());
      })
      .catch((e) => {
        logger.error({
          errorStack: (e as Error).stack,
          errorMessage: (e as Error).message,
          msg: "流量数据库每日建表失败 " + new Date(),
        });
      });
  });
}

const job = startWebDataTableJob();

export function cancelWebDataJob() {
  job.cancel();
}
