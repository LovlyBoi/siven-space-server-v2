import KoaRouter from "koa-router";
import { imageResize } from '../middleware/image.middleware'

export const imageRouter = new KoaRouter({ prefix: "/image" });

imageRouter.get('/:filename', imageResize)
