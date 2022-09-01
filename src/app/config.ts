import { resolve } from "path";
import dotenv from "dotenv";

// 加载 .env 和 .env.local 文件。由于 .env 加载不会使用 local 覆盖 .env，所以自己写了一个
// 至于加载不同环境的 .env，因为没有打包工具注入，我也没办法区分生产环境
const { error: envError, parsed: envParsed } = dotenv.config();
const { error: localEnvError, parsed: localEnvParsed } = dotenv.config({
  path: resolve(process.cwd(), ".env.local"),
});

const env = Object.assign(
  {},
  envError ? {} : envParsed,
  localEnvError ? {} : localEnvParsed
);

Object.assign(process.env, env);

export default env;
