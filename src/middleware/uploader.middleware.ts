import multer from "koa-multer";
import { nanoid } from "nanoid";
import { extname } from "path";
import { useCacheLocation } from "../utils/cache";

function makeStorage(
  destination: string,
  noExt: boolean = false,
  size?: number
) {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      cb(null, destination);
    },
    filename: async (req, file, cb) => {
      // 生成一个nanoid的文件名
      const filename = noExt
        ? nanoid(size)
        : `${nanoid(size)}${extname(file.originalname)}`;
      console.log(filename);
      cb(null, filename);
    },
  });
}

export const imageUploaderMiddleware = multer({
  storage: makeStorage(useCacheLocation("./image"), false, 16),
}).array("file");

export const markdownUploaderMiddleware = multer({
  storage: makeStorage(useCacheLocation("./markdown"), true),
}).array("file");
