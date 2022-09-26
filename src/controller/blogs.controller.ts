import { Middleware } from "koa";
import { useEmit, ErrorType } from "../utils/useErrorEmit";
import { blogService } from "../service/blogs.service";
import { isMarkDownExist } from "../utils/cache";
import type { Blog, BlogForJSON, ParsedHtmlForJSON } from "../types";

const {
  getAllBlogs,
  getEssayBlogs,
  getNoteBlogs,
  getBlogById: getBlogByIdService,
  publishBlog: publishBlogService,
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
    }
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
    await next();
  };

  // 发布博客
  publishBlog: Middleware = async (ctx, next) => {
    const { success, msg } = validateBlog(ctx.request.body);
    if (!success) {
      return useEmit(ErrorType.BadRequest, ctx, new Error("请求参数错误"), msg);
    }
    const blogData = ctx.request.body as Blog;
    console.log(blogData);
    try {
      await publishBlogService(blogData);
    } catch (e) {
      return useEmit(
        ErrorType.BadRequest,
        ctx,
        e as Error,
        (e as Error).message
      );
    }
    ctx.body = "发布成功";
    await next();
  };
}

function validateBlog(blog: { [k: string]: any }): {
  success: boolean;
  msg: string;
} {
  let ret = { success: false, msg: "" };
  const requireKey = ["id", "author", "type", "title"]
  for (let i = 0; i < requireKey.length; i++) {
    const key = requireKey[i]
    if (!blog[key]) {
      ret.msg = `blog.${key} 字段是必须的`;
      return ret;
    }
  }
  // 处理picturs字段
  if (Array.isArray(blog.pictures)) {
    blog.pictures = blog.pictures.filter((item) => item).join(" ");
  } else if (typeof blog.pictures !== "string") {
    ret.msg = "blog.pictures 字段必须是 string[] 或 string";
  }
  if (blog.tag && !(typeof blog.tag === "object")) {
    ret.msg = "blog.pictures 字段必须是 string[] 或 string";
  } else if (!blog.tag.color) {
    ret.msg = "blog.tag.color 字段是必须的";
  } else if (!blog.tag.name) {
    ret.msg = "blog.tag.name 字段是必须的";
  }
  ret.success = true;
  return ret;
}

const blogController = new BlogController();

export { blogController };
