import { Middleware } from "koa";
import { useEmit, ErrorType } from "../utils/useErrorEmit";
import { blogService } from "../service/blogs.service";

const { getAllBlogs, getEssayBlogs, getNoteBlogs } = blogService;

class BlogController {
  // 根据类型进行分类
  getBlogs: Middleware = async (ctx, next) => {
    const type = ctx.query.type;
    let cards: Buffer | string;
    try {
      if (type === "note") {
        cards = await getNoteBlogs();
      } else if (type === "essay") {
        cards = await getEssayBlogs();
      } else {
        cards = await getAllBlogs();
      }
    } catch (e: unknown) {
      return useEmit(ErrorType.InternalServerError, ctx, e as Error);
    }
    ctx.type = "application/json";
    ctx.body = cards;
    await next();
  };
}

const blogController = new BlogController();

export { blogController };
