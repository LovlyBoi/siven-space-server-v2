import mysql from "mysql2";
import type { Pool } from "mysql2";
import { logger } from "../utils/log";

function parsePort(port: string | undefined): number | undefined {
  return port == null
    ? undefined
    : Number.isNaN(parseInt(port))
    ? undefined
    : parseInt(port);
}

let mainConnections: Pool | null = null;
let webDataConnections: Pool | null = null;

try {
  mainConnections = mysql.createPool({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: parsePort(process.env.DB_PORT),
  });
  logger.info("🔗 连接主数据库...");
} catch (e) {
  console.log("❌ 连接主数据库失败")
  logger.error({
    errorStack: (e as Error).stack,
    errorMessage: (e as Error).message,
  });
}

try {
  webDataConnections = mysql.createPool({
    database: process.env.DB_WD_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: parsePort(process.env.DB_PORT),
  });
  logger.info("🔗 连接流量数据库...");
} catch (e) {
  console.log("❌ 连接流量数据库失败")
  logger.error({
    errorStack: (e as Error).stack,
    errorMessage: (e as Error).message,
  });
}

const mainPromisePool = mainConnections!.promise();
const webDataPromisePool = webDataConnections!.promise();

export { mainPromisePool as pool, webDataPromisePool as wdPool };
