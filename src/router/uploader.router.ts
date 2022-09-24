import KoaRouter from "koa-router";
import { uploaderController } from "../controller/uploader.controller";
import {
  imageUploaderMiddleware,
  markdownUploaderMiddleware,
} from "../middleware/uploader.middleware";
const { imageUploader, markdownUploader } = uploaderController;

const uploadRouter = new KoaRouter({ prefix: "/upload" });

uploadRouter.post("/image", imageUploaderMiddleware, imageUploader);

uploadRouter.post("/markdown", markdownUploaderMiddleware, markdownUploader);

export { uploadRouter };
