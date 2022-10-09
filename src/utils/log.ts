import winston from "winston";
import { format } from "winston";

const consoleTransport: winston.transport[] = [
  new winston.transports.Console({
    format: format.printf((options) =>
      options.message instanceof Object
        ? JSON.stringify(options.message, null, 2)
        : options.message
    ),
  }),
];

const fileTransport: winston.transport[] = [
  new winston.transports.File({
    filename: "logs/sivenspace_info.log",
    level: "info",
  }),
  new winston.transports.File({
    filename: "logs/sivenspace_warn.log",
    level: "warn",
  }),
  new winston.transports.File({
    filename: "logs/sivenspace_error.log",
    level: "error",
  }),
];

export const logger = winston.createLogger({
  transports:
    process.env.LOG_LEVEL === "console"
      ? consoleTransport
      : consoleTransport.concat(...fileTransport),
  format: format.combine(
    format.timestamp(),
    format.printf((options) => JSON.stringify(options, null, 2))
  ),
});
