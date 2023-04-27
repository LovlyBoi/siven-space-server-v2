import KoaRouter from "koa-router";
import { authController } from "../controller/auth.controller";

const { userRegister, userLogin, refreshToken, getUserInfo } = authController;

const authRouter = new KoaRouter({ prefix: "/auth" });

authRouter.post("/login", userLogin);

authRouter.post("/register", userRegister);

authRouter.post("/refreshToken", refreshToken);

authRouter.post("/getUserInfo", getUserInfo);
export { authRouter };
