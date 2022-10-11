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

let connections: Pool | null = null;

try {
  connections = mysql.createPool({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: parsePort(process.env.DB_PORT),
  });
  logger.info('数据库连接成功')
} catch (e) {
  logger.error({
    errorStack: (e as Error).stack,
    errorMessage: (e as Error).message,
  });
}

export const promisePool = connections!.promise();

export { promisePool as pool };
