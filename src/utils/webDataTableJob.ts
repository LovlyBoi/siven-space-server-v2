import schedule from "node-schedule";
import {
  createTodayWebDataTable,
  updateTodayVisitors,
} from "../dao/tracker.dao";
import { logger } from "./log";

function startDailyVisitorTableJob() {
  logger.info("启动流量数据库每日建表任务");
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

function startDailyPvRecordsJob() {
  logger.info("启动流量数据库每日更新任务");
  // 每天23:59:50更新一下日活
  return schedule.scheduleJob("50 59 23 * * *", () => {
    updateTodayVisitors()
      .then(() => {
        logger.info("流量数据库每日更新pv成功 " + new Date());
      })
      .catch((e) => {
        logger.error({
          errorStack: (e as Error).stack,
          errorMessage: (e as Error).message,
          msg: "流量数据库每日更新pv失败 " + new Date(),
        });
      });
  });
}

const dailyVisitorJob = startDailyVisitorTableJob();
const dailyPvRecordsJob = startDailyPvRecordsJob();

export function cancelWebDataJob() {
  dailyVisitorJob.cancel();
  dailyPvRecordsJob.cancel();
}
