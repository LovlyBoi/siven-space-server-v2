import KoaRouter from "koa-router";
import { authController } from "../controller/auth.controller";
import { checkAccessToken } from "../middleware/auth.middleware";

const {
  userRegister,
  userLogin,
  refreshToken,
  getUserInfo,
  searchUsers,
  setUserRole,
} = authController;

const authRouter = new KoaRouter({ prefix: "/auth" });

authRouter.post("/login", userLogin);

authRouter.post("/register", userRegister);

authRouter.post("/refreshToken", refreshToken);

authRouter.post("/getUserInfo", getUserInfo);

authRouter.get("/searchUsers", checkAccessToken, searchUsers);

authRouter.post("/updateUserRole", checkAccessToken, setUserRole);

export { authRouter };
