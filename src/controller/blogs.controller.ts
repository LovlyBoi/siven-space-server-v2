import { Middleware } from "koa";
import { useEmit, ErrorType } from "../utils/useErrorEmit";
import { blogService } from "../service/blogs.service";
import { isMarkDownExist } from "../utils/cache";
import type { BlogForJSON, ParsedHtmlForJSON } from "../types";

const {
  getAllBlogs,
  getEssayBlogs,
  getNoteBlogs,
  getBlogById: getBlogByIdService,
} = blogService;

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
  // 获取博客正文
  getBlogById: Middleware = async (ctx, next) => {
    const id = ctx.params.id as string;
    console.log(ctx.params.id);
    if (!isMarkDownExist(id)) {
      return useEmit(ErrorType.NotFound, ctx, new Error("请求地址不存在"));
    } else {
      let data: ParsedHtmlForJSON;
      try {
        data = await getBlogByIdService(id);
      } catch (e) {
        return useEmit(
          ErrorType.InternalServerError,
          ctx,
          new Error("获取博客失败")
        );
      }
      ctx.body = data;
    }
    await next();
  };
}

const blogController = new BlogController();

export { blogController };
