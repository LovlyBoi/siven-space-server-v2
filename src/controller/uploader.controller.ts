import { Middleware } from "koa";
import { File } from "koa-multer";
import { createReadStream, createWriteStream } from "fs";
import { useEmit, ErrorType } from "../utils/useErrorEmit";
import { uploaderService } from "../service/uploader.service";
import { blogService } from "../service/blogs.service";
import { logger } from "../utils/log";
import { cacheMarkdownPath, removeCache } from "../utils/cache";
import { resolve } from "path";

const {
  removeImage: removeImageService,
  removeMarkdown: removeMarkdownService,
} = uploaderService;

const { updateBlogDate } = blogService;

class UploaderController {
  imageUploader: Middleware = async (ctx, next) => {
    if ((ctx.req as any).files.length >= 1) {
      const url = (ctx.req as any).files.map(
        (file: File) =>
          `${process.env.APP_HOST}:${process.env.APP_PORT}/image/${file.filename}`
      );
      // console.log(url)
      logger.info("图片上传成功" + url.join(" "));
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
      logger.info("markdown上传成功" + id.join(" "));
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

  // Markdown 重新上传
  markdownReUploader: Middleware = async (ctx, next) => {
    const id = ctx.params.id as string;
    if ((ctx.req as any).files.length >= 1) {
      const tempId = (ctx.req as any).files.map(
        (file: File) => file.filename
      )[0];
      if (!tempId || !id) {
        useEmit(
          ErrorType.InternalServerError,
          ctx,
          new Error("上传失败 未获取到文件"),
          "上传失败"
        );
      }
      try {
        createReadStream(resolve(cacheMarkdownPath, tempId)).pipe(
          createWriteStream(resolve(cacheMarkdownPath, id))
        ).on('finish', () => {
          // 删除tmp文件
          removeMarkdownService(tempId);
          // 更新当前博客日期
          updateBlogDate(id)
          // 清除 HTML 缓存
          removeCache(id)
        });
      } catch (e) {
        useEmit(
          ErrorType.InternalServerError,
          ctx,
          new Error("上传失败 文件写入失败"),
          "文件写入失败"
        );
      }
      logger.info("markdown重新上传成功 " + id)
      ctx.body = {
        id,
        msg: "重新上传成功！",
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
