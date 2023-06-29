import { token } from "../utils/token";
import { nanoid } from "nanoid";
import { hash, compare } from "../utils/bcrypt";
import { omit } from "lodash";
import {
  getUserInfoById,
  getUserInfoByName,
  createNewUser as createNewUserDao,
  searchUserByIdOrName,
  updateUserRole,
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
      state.userInfo = omit(info, ["password", "unuse"]);
      console.log(state.userInfo);
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
  // 根据token获取用户信息
  getUserInfo = async (id: string) => {
    // ToDo: 获取用户信息
    const state: ServiceState = {
      isSuccess: false,
      msg: "",
      userInfo: undefined,
    };
    try {
      const result = await getUserInfoById(id);
      if (result.length < 1) {
        state.msg = "该用户尚未注册";
        return state;
      } else if (result[0].unuse) {
        state.msg = "该用户已注销";
        return state;
      }
      state.isSuccess = true;
      state.userInfo = omit(result[0], ["unuse", "password"]);
    } catch (e) {
      const error = e as Error;
      logger.error({ errorMessage: error.message, errorStack: error.stack });
      throw e;
    }
    return state;
  };
  // 根据id或name查找用户
  searchUser = async (idOrName: string) => {
    return searchUserByIdOrName(idOrName)
  }
  // 0.5 -- 0.001
  getAccessToken = (id: string, expHour: number = 0.5) =>
    token.signToken(
      {
        type: "access_token",
        aud: id,
      },
      Math.floor(Date.now() / 1000) + 60 * 60 * expHour
    );
    // 24 * 1 -- 0.003
  getRefreshToken = (id: string, expHour: number = 24 * 1) =>
    token.signToken(
      {
        type: "refresh_token",
        aud: id,
      },
      Math.floor(Date.now() / 1000) + 60 * 60 * expHour
    );
  generateToken = async (id: string) => {
    // ToDo: 生成access_token以及refresh_token
    // 1小时失效的短期token
    const accessToken = await this.getAccessToken(id);
    // 3天失效的长期token
    const refreshToken = await this.getRefreshToken(id);

    return {
      accessToken,
      refreshToken,
    };
  };
  parseToken = (
    user_token: string
  ): { isOk: boolean; type: string; msg: string; data: any } => {
    const ret = {
      isOk: false,
      type: "",
      msg: "",
      data: {} as any,
    };
    if (!user_token) {
      ret.msg = "未携带token";
      return ret;
    }
    const result = token.verifyToken(user_token);
    ret.isOk = result.isOk;
    if (result.isOk) {
      ret.msg = "校验成功";
      ret.type = "ok";
      ret.data = result.payload;
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
  verifyRefreshToken = (
    refreshToken: string
  ): { isOk: boolean; type: string; msg: string; data: any } => {
    // ToDo: 校验refresh_token
    const result = this.parseToken(refreshToken);
    if (result.data?.type && result.data?.type !== "refresh_token") {
      console.log(result);
      result.isOk = false;
      result.msg = "token类型错误";
      result.type = "token type error";
    }
    return result;
  };
  // 晋升用户
  updateUserRole = (id: string, role: 1 | 2 | 3) => {
    return updateUserRole(id, role)
  }
}

const authService = new AuthService();

export { authService };
