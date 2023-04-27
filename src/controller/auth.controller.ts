import { Middleware } from "koa";
import { trackerService } from "../service/tracker.service";
import { ErrorType, useEmit } from "../utils/useErrorEmit";
import { token } from "../utils/token";
import { authService } from "../service/auth.service";
import type { UserInfo } from "../types";

const {
  createNewUser,
  login,
  generateToken,
  parseToken,
  verifyRefreshToken,
  getUserInfo: getUserInfoService,
} = authService;

class AuthController {
  userRegister: Middleware = async (ctx, next) => {
    // ToDo: 用户注册。参数校验，service调用
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    if (!username || !password) {
      return useEmit(ErrorType.Forbidden, ctx, new Error(), "用户信息不全");
    }
    let isSuccess = false,
      msg = "",
      userInfo: Omit<UserInfo, "unuse" | "password"> | undefined;
    try {
      const state = await createNewUser(username, password);
      isSuccess = state.isSuccess;
      msg = state.msg;
      userInfo = state.userInfo;
    } catch (e) {}
    ctx.body = {
      isSuccess,
      msg,
      userInfo,
      token: isSuccess ? await generateToken(userInfo?.id ?? "") : undefined,
    };
    await next();
  };
  userLogin: Middleware = async (ctx, next) => {
    // ToDo: 登录接口。
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    if (!username || !password) {
      return useEmit(
        ErrorType.Forbidden,
        ctx,
        new Error("用户登录身份信息不全"),
        "用户信息不全"
      );
    }
    const state: {
      isSuccess: boolean;
      msg: string;
      token?: {
        accessToken: string;
        refreshToken: string;
      };
      userInfo?: Omit<UserInfo, "unuse" | "password">;
    } = {
      isSuccess: true,
      msg: "登录成功",
    };
    try {
      const { isSuccess, msg, userInfo } = await login(username, password);
      if (isSuccess) {
        state.token = await generateToken(userInfo?.id ?? "");
        state.userInfo = userInfo!;
      } else {
        state.isSuccess = isSuccess;
        state.msg = msg;
      }
    } catch (e) {
      state.isSuccess = false;
      useEmit(ErrorType.InternalServerError, ctx, e as Error);
    }
    ctx.body = state;
    await next();
  };
  getUserInfo: Middleware = async (ctx, next) => {
    const token = ctx.request.body.token;
    if (!token) {
      return useEmit(
        ErrorType.Unauthorized,
        ctx,
        new Error("未携带refresh_token"),
        "未携带refresh_token"
      );
    }
    const result = parseToken(token);
    if (result.isOk) {
      const id  = result.data?.aud
      if (!id) {
        ctx.body = {
          isSeccess: false,
          msg: 'token中id为空',
        }
        return await next();
      }
      const state = await getUserInfoService(id)
      if (!state.isSuccess) {
        ctx.body = {
          isSuccess: state.isSuccess,
          msg: state.msg,
        }
        return await next();
      }
      ctx.body = {
        isSuccess: true,
        userInfo: state.userInfo,
      };
    } else {
      ctx.body = {
        isSuccess: false,
        type: result.type,
        msg: result.msg,
      };
    }
    await next();
  };
  refreshToken: Middleware = async (ctx, next) => {
    const refreshToken = ctx.request.body.refreshToken;
    if (!refreshToken) {
      return useEmit(
        ErrorType.Unauthorized,
        ctx,
        new Error("未携带refresh_token"),
        "未携带refresh_token"
      );
    }
    const result = verifyRefreshToken(refreshToken);
    if (result.isOk) {
      // 长期token有效
      ctx.body = {
        isSuccess: true,
        token: await generateToken(result.data?.aud ?? ""),
      };
    } else {
      ctx.body = {
        isSuccess: false,
        type: result.type,
        msg: result.msg,
      };
    }
    await next();
  };
}

const authController = new AuthController();

export { authController };
