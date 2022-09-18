import multer from "koa-multer";
import { nanoid } from 'nanoid'
import { resolve, extname } from "path";

function makeStorage(destination: string) {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      cb(null, destination);
    },
    filename: async (req, file, cb) => {
      // 生成一个nanoid的文件名
      const filename = `${nanoid(16)}${extname(file.originalname)}`
      console.log(filename);
      cb(null, filename);
    },
  });
}

export const uploaderMiddleware = multer({
  storage: makeStorage(resolve(process.env.CACHE_DIR!, "./image")),
}).array("file");
