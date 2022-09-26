import type { Middleware } from "koa";
import { createReadStream, existsSync, ReadStream } from "fs";
import { resolve, extname } from "path";
import sharp from "sharp";
import { cacheImagePath } from "../utils/cache";
import { ErrorType, useEmit } from "../utils/useErrorEmit";

const MIME: Record<string, string> = {
  css: "text/css",
  gif: "image/gif",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  webp: "image/webp",
  js: "text/javascript",
  json: "application/json",
  pdf: "application/pdf",
  png: "image/png",
  svg: "image/svg+xml",
  swf: "application/x-shockwave-flash",
  tiff: "image/tiff",
  txt: "text/plain",
  wav: "audio/x-wav",
  wma: "audio/x-ms-wma",
  wmv: "video/x-ms-wmv",
  xml: "text/xml",
};

export const imageResize: Middleware = async (ctx, next) => {
  const filename = ctx.params.filename as string;
  const fileType = MIME[extname(filename).split(".").slice(-1)[0]];
  let width: number | null = parseFloat(ctx.query.w as string);
  width = Number.isNaN(width) ? null : width;
  const filePath = resolve(cacheImagePath, filename);
  ctx.type = fileType;
  if (!existsSync(filePath)) {
    return useEmit(ErrorType.NotFound, ctx, new Error("Not Found"));
  }
  let image: ReadStream;
  const reader = createReadStream(filePath);

  if (width == null) {
    image = reader;
    ctx.body = image;
  } else {
    // 有请求带宽度
    const transformer = sharp().resize(width);
    ctx.body = reader.pipe(transformer);
  }

  await next();
};
