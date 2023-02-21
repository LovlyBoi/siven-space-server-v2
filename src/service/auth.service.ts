import { token } from "../utils/token";
import { hash } from "../utils/bcrypt"
import { VerifyErrors } from "jsonwebtoken";

class AuthService {
  createNewUser = async (username: string, password: string) => {
    // ToDo: 注册新用户
    const code = await hash(password)
    console.log(code.length)
    // 注册新用户（dao层调用）
    // 返回用户信息（dao层调用）
    return {
      avatar: "http://xxx.avatar.com/123",
      username: "用户名",
    };
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
      if (payload?.type !== 'refresh_token') {
        ret.isOk = false;
        ret.msg = 'token类型错误';
        ret.type = 'token type error';
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
