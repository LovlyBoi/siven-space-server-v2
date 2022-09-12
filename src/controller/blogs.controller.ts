import { Middleware } from "koa";
import { useEmit, ErrorType } from "../utils/useErrorEmit";
import { blogService } from "../service/blogs.service";
import { BlogForJSON } from '../types'

const { getAllBlogs, getEssayBlogs, getNoteBlogs } = blogService;

class BlogController {
  // 根据类型进行分类
  getBlogs: Middleware = async (ctx, next) => {
    const type = ctx.query.type;
    let cards: BlogForJSON[] | string | Buffer;
    try {
      if (type === "note") {
        cards = await getNoteBlogs();
      } else if (type === "essay") {
        cards = await getEssayBlogs();
      } else {
        cards = await getAllBlogs();
      }
    } catch (e: unknown) {
      const err = e as Error;
      return useEmit(ErrorType.InternalServerError, ctx, err, "cards 获取失败");
    }
    ctx.type = "application/json";
    ctx.body = cards;
    await next();
  };
}

const blogController = new BlogController();

export { blogController };
