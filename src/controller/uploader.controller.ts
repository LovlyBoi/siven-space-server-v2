import { Middleware } from "koa";
import { File } from "koa-multer";
import { useEmit, ErrorType } from "../utils/useErrorEmit";

class UploaderController {
  imageUploader: Middleware = async (ctx, next) => {
    if ((ctx.req as any).files.length >= 1) {
      const url = (ctx.req as any).files.map(
        (file: File) =>
          `${process.env.APP_HOST}:${process.env.APP_PORT}/${file.filename}`
      );
      ctx.body = {
        url,
        msg: "上传成功！",
      };
    } else {
      useEmit(
        ErrorType.InternalServerError,
        ctx,
        new Error("上传失败 未获取到文件"),
        "上传失败"
      );
    }
    await next();
  };
}

export const uploaderController = new UploaderController();
