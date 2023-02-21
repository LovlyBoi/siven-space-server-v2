import { resolve } from "path";
import dotenv from "dotenv";

// 加载 .env 和 .env.local 文件。由于 .env 加载不会使用 local 覆盖 .env，所以自己写了一个
// 至于加载不同环境的 .env，因为没有打包工具注入，我也没办法区分生产环境
const { error: envError, parsed: envParsed } = dotenv.config();
const { error: localEnvError, parsed: localEnvParsed } = dotenv.config({
  path: resolve(process.cwd(), ".env.local"),
});

function hasValue(value: string | undefined): boolean {
  if (value === "null" || value === "undefined") {
    return false;
  } else {
    return !!value;
  }
}

function loadEnv(...envs: (object | undefined)[]) {
  const ret: object = {};
  for (let i = 0; i < envs.length; i++) {
    const curObj = envs[i];
    if (!curObj) continue;
    for (let key in curObj) {
      if (hasValue((curObj as any)[key])) {
        (ret as any)[key] = (curObj as any)[key];
      }
    }
  }
  return ret;
}

// const env = Object.assign(
//   {},
//   envError ? {} : envParsed,
//   localEnvError ? {} : localEnvParsed
// );

// Object.assign 不能处理 'null'
const env = loadEnv(
  {},
  envError ? {} : envParsed,
  localEnvError ? {} : localEnvParsed
);

Object.assign(process.env, env);

export default env;
