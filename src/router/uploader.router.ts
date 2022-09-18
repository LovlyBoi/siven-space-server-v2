import KoaRouter from "koa-router";
import { uploaderController } from "../controller/uploader.controller";
import { uploaderMiddleware } from "../middleware/uploader.middleware";
const { imageUploader } = uploaderController;

const uploadRouter = new KoaRouter({ prefix: "/upload" });

uploadRouter.post("/image", uploaderMiddleware, imageUploader);

export { uploadRouter };
