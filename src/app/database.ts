import mysql from "mysql2";
import type {  } from 'mysql2';

function parsePort(port: string | undefined): number | undefined {
  return port == null
    ? undefined
    : Number.isNaN(parseInt(port))
    ? undefined
    : parseInt(port);
}

const connections = mysql
  .createPool({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: parsePort(process.env.DB_PORT),
  })
  .promise();

export { connections as pool };
