import { token } from "../utils/token";
import { nanoid } from "nanoid";
import { hash, compare } from "../utils/bcrypt";
import { omit } from "lodash";
import {
  getUserInfoById,
  getUserInfoByName,
  createNewUser as createNewUserDao,
} from "../dao/users.dao";
import { logger } from "../utils/log";
import type { UserInfo } from "../types";

type ServiceState = {
  isSuccess: boolean;
  userInfo?: Omit<UserInfo, "unuse" | "password">;
  msg: string;
};

class AuthService {
  createNewUser = async (username: string, password: string) => {
    // ToDo: 注册新用户
    const state: ServiceState = {
      isSuccess: false,
      msg: "",
    };
    const id = nanoid();
    const code = await hash(password);
    console.log(code.length);
    // 注册新用户（dao层调用）
    try {
      if ((await getUserInfoByName(username)).length > 0) {
        state.isSuccess = false;
        state.msg = "该用户名已被占用";
        return state;
      }
      await createNewUserDao(
        id,
        username,
        code,
        1,
        "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
      );
      state.isSuccess = true;
      state.msg = "创建成功";
      const info = (await getUserInfoById(id))[0];
      state.userInfo = omit(info, ['password', 'unuse']);
      console.log(state.userInfo)
    } catch (e) {
      const error = e as Error;
      logger.error({ errorMessage: error.message, errorStack: error.stack });
      throw e;
    }
    return state;
  };
  login = async (username: string, password: string): Promise<ServiceState> => {
    const state: ServiceState = {
      isSuccess: false,
      msg: "",
    };
    try {
      const result = await getUserInfoByName(username);
      // console.log(result);
      if (result.length < 1) {
        state.msg = "该用户尚未注册";
      } else if (result[0].unuse) {
        state.msg = "该用户已注销";
      } else if (!(await compare(password, result[0].password))) {
        state.msg = "密码错误";
      } else {
        state.isSuccess = true;
        state.userInfo = omit(result[0], ["unuse", "password"]);
        state.msg = "登陆成功";
      }
    } catch (e) {
      const error = e as Error;
      logger.error({ errorMessage: error.message, errorStack: error.stack });
      throw e;
    }
    return state;
  };
  getUserInfo = async (userId: string) => {
    // ToDo: 获取用户信息
    return {
      avatar: "http://xxx.avatar.com/123",
      username: "用户名",
    };
  };
  getAccessToken = (expHour: number = 0.5) =>
    token.signToken(
      {
        type: "access_token",
      },
      Math.floor(Date.now() / 1000) + 60 * 60 * expHour
    );
  getRefreshToken = (expHour: number = 24 * 3) =>
    token.signToken(
      {
        type: "refresh_token",
      },
      Math.floor(Date.now() / 1000) + 60 * 60 * expHour
    );
  generateToken = async () => {
    // ToDo: 生成access_token以及refresh_token
    // 1小时失效的短期token
    const accessToken = await this.getAccessToken();
    // 3天失效的长期token
    const refreshToken = await this.getRefreshToken();

    return {
      accessToken,
      refreshToken,
    };
  };
  verifyRefreshToken = (
    refreshToken: string
  ): { isOk: boolean; type: string; msg: string } => {
    // ToDo: 校验refresh_token
    const ret = {
      isOk: false,
      type: "",
      msg: "",
    };
    if (!refreshToken) {
      ret.msg = "未携带refresh_token";
      return ret;
    }
    const result = token.verifyToken(refreshToken);
    ret.isOk = result.isOk;
    if (ret.isOk) {
      const payload = result.payload as any;
      if (payload?.type !== "refresh_token") {
        ret.isOk = false;
        ret.msg = "token类型错误";
        ret.type = "token type error";
        return ret;
      }
      ret.msg = "校验成功";
      ret.type = "ok";
      return ret;
    } else {
      if (result.error?.name === "TokenExpiredError") {
        ret.msg = "登录超时，请重新登陆";
        ret.type = result.error.message;
      } else if (result.error?.name === "JsonWebTokenError") {
        ret.msg = "token解析失败";
        ret.type = result.error.message;
      } else if (result.error?.name === "NotBeforeError") {
        ret.msg = "token还未生效";
        ret.type = result.error.message;
      } else {
        let n: never;
      }
    }
    return ret;
  };
}

const authService = new AuthService();

export { authService };
