import { pool } from "../app/database";
import {
  INIT_BLOG_TABLE,
  INIT_USER_TABLE,
  INIT_AUDITS_TABLE,
} from "./statements";
import { createTodayWebDataTable } from "./tracker.dao";

export async function initDataBase() {
  try {
    await Promise.all([
      pool.execute(INIT_BLOG_TABLE),
      pool.execute(INIT_USER_TABLE),
      pool.execute(INIT_AUDITS_TABLE),
    ]);
  } catch (e) {
    console.error("初始化 主数据库 失败");
    throw e;
  }
  try {
    await createTodayWebDataTable();
  } catch (e) {
    console.error("初始化 流量数据库 失败");
    throw e;
  }
}
