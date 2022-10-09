import { Middleware } from "koa";
import { File } from "koa-multer";
import { useEmit, ErrorType } from "../utils/useErrorEmit";
import { uploaderService } from "../service/uploader.service";
import { logger } from "../utils/log";

const {
  removeImage: removeImageService,
  removeMarkdown: removeMarkdownService,
} = uploaderService;

class UploaderController {
  imageUploader: Middleware = async (ctx, next) => {
    if ((ctx.req as any).files.length >= 1) {
      const url = (ctx.req as any).files.map(
        (file: File) =>
          `${process.env.APP_HOST}:${process.env.APP_PORT}/image/${file.filename}`
      );
      // console.log(url)
      logger.info('图片上传成功' + url.join(' '))
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

  markdownUploader: Middleware = async (ctx, next) => {
    if ((ctx.req as any).files.length >= 1) {
      const id = (ctx.req as any).files.map((file: File) => file.filename);
      // console.log("markdown", id);
      logger.info("markdown上传成功" + id.join(' '))
      ctx.body = {
        id,
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

  // 删除Image
  removeImage: Middleware = async (ctx, next) => {
    const filename = ctx.params.filename;
    if (!filename) {
      return useEmit(ErrorType.NotFound, ctx, new Error("图片不存在"));
    }
    const result = await removeImageService(filename);
    if (!result) {
      return useEmit(
        ErrorType.InternalServerError,
        ctx,
        new Error(`删除图片 ${filename}失败`),
        "删除失败"
      );
    }
    ctx.body = "删除成功";
    await next();
  };

  // 删除Markdown
  removeMarkdown: Middleware = async (ctx, next) => {
    const id = ctx.params.id as string;
    if (!id) {
      return useEmit(ErrorType.NotFound, ctx, new Error("Markdown 不存在"));
    }
    const result = await removeMarkdownService(id);
    if (!result) {
      return useEmit(
        ErrorType.InternalServerError,
        ctx,
        new Error(`删除Markdown ${id}失败`),
        "删除失败"
      );
    }
    ctx.body = "删除成功";
    await next();
  };
}

export const uploaderController = new UploaderController();
