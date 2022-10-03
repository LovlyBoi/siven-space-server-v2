import { pool } from "../app/database";
import { INIT_DATABASE } from "./statement";

export async function initDataBase() {
  let result;
  try {
    result = await pool.execute(INIT_DATABASE);
  } catch (e) {
    console.error("初始化数据库失败");
    throw e;
  }
  return result;
}
