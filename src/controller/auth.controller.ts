import { Middleware } from "koa";
import { trackerService } from "../service/tracker.service";
import { ErrorType, useEmit } from "../utils/useErrorEmit";
import { token } from "../utils/token";
import { authService } from "../service/auth.service";

const { createNewUser, generateToken, verifyRefreshToken } = authService;

class AuthController {
  userRegister: Middleware = async (ctx, next) => {
    // ToDo: 用户注册。参数校验，service调用
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    if (!username || !password) {
      return useEmit(ErrorType.Forbidden, ctx, new Error(), "用户信息不全");
    }
    const userInfo = createNewUser();
    ctx.body = {
      isSuccess: true,
      msg: "登录成功",
      token: await generateToken(),
      userInfo,
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
    ctx.body = {
      isSuccess: true,
      msg: "登录成功",
      token: await generateToken(),
    };
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
        token: await generateToken(),
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
