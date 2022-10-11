import { Middleware } from "koa";
import { useEmit, ErrorType } from "../utils/useErrorEmit";
import { blogService } from "../service/blogs.service";
import { isMarkDownExist } from "../utils/cache";
import type { Blog, BlogForJSON, ParsedHtmlForJSON } from "../types";
import { logger } from "../utils/log";

const {
  getAllBlogs,
  getEssayBlogs,
  getNoteBlogs,
  getBlogById: getBlogByIdService,
  getBlogMarkdown: getBlogMarkdownService,
  editBlogMarkdown: editBlogMarkdownService,
  publishBlog: publishBlogService,
  deleteBlog: deleteBlogService,
  updateBlogDate: updateBlogDateService,
} = blogService;

class BlogController {
  // 根据类型进行分类
  getBlogs: Middleware = async (ctx, next) => {
    const type = ctx.query.type;
    let ps = parseInt(ctx.query.ps as string);
    let pn = parseInt(ctx.query.pn as string);
    ps = ps == null || Number.isNaN(ps) ? 10 : ps;
    pn = pn == null || Number.isNaN(pn) ? 1 : pn;
    let cards: BlogForJSON[] | string | Buffer;
    try {
      if (type === "note") {
        cards = await getNoteBlogs(ps, pn);
      } else if (type === "essay") {
        cards = await getEssayBlogs(ps, pn);
      } else {
        cards = await getAllBlogs(ps, pn);
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
    const notFound = () =>
      useEmit(ErrorType.NotFound, ctx, new Error("请求地址不存在"));
    const serverError = () =>
      useEmit(ErrorType.InternalServerError, ctx, new Error("获取博客失败"));
    if (!isMarkDownExist(id)) {
      return notFound();
    }
    // 根据query参数指定返回的是解析好的还是markdown原文
    const type = ctx.query.type === "markdown" ? "markdown" : "html";
    if (type === "html") {
      let data: ParsedHtmlForJSON;
      try {
        data = await getBlogByIdService(id);
      } catch (e) {
        return serverError();
      }
      ctx.body = data;
    } else {
      try {
        const readStream = getBlogMarkdownService(id);
        if (!readStream) {
          return notFound();
        } else {
          ctx.body = readStream;
        }
      } catch (e) {
        return serverError();
      }
    }
    await next();
  };
  // 编辑博客
  editBlogMarkdown: Middleware = async (ctx, next) => {
    const id = ctx.params.id as string;
    const content = ctx.request.body?.content as string | undefined;
    if (content == null) {
      return useEmit(
        ErrorType.BadRequest,
        ctx,
        new Error("请求没有content字段"),
        "content字段是必须的"
      );
    }
    try {
      await editBlogMarkdownService(id, content);
      await updateBlogDateService(id);
      ctx.body = "修改成功";
    } catch (e) {
      console.log(e)
      return useEmit(
        ErrorType.InternalServerError,
        ctx,
        new Error("修改失败"),
        "修改失败"
      );
    }
  };
  // 发布博客
  publishBlog: Middleware = async (ctx, next) => {
    const { success, msg } = validateBlog(ctx.request.body);
    if (!success) {
      return useEmit(ErrorType.BadRequest, ctx, new Error("请求参数错误"), msg);
    }
    const blogData = ctx.request.body as Blog;
    logger.info({ msg: '发布博客', blogData })
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
  // 删除博客
  deleteBlog: Middleware = async (ctx, next) => {
    const id = ctx.params.id as string;
    try {
      await deleteBlogService(id);
    } catch (e) {
      return useEmit(
        ErrorType.InternalServerError,
        ctx,
        e as Error,
        "删除失败"
      );
    }
    ctx.body = "删除成功";
    await next();
  };
}

function validateBlog(blog: { [k: string]: any }): {
  success: boolean;
  msg: string;
} {
  let ret = { success: false, msg: "" };
  const requireKey = ["id", "author", "type", "title"];
  for (let i = 0; i < requireKey.length; i++) {
    const key = requireKey[i];
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
