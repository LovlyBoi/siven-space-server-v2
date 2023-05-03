import { Middleware } from "koa";
import { useEmit, ErrorType } from "../utils/useErrorEmit";
import { blogService } from "../service/blogs.service";
import { isMarkDownExist } from "../utils/cache";
import { Blog, BlogForJSON, BlogType, ParsedHtmlForJSON } from "../types";
import { logger } from "../utils/log";

const {
  getAllBlogs,
  // getEssayBlogs,
  // getNoteBlogs,
  hasNextPage,
  getRecommend: getRecommendService,
  getBlogs: getBlogsService,
  getBlogById: getBlogByIdService,
  getBlogMarkdown: getBlogMarkdownService,
  editBlogMarkdown: editBlogMarkdownService,
  publishBlog: publishBlogService,
  editBlogInfo: editBlogInfoService,
  deleteBlog: deleteBlogService,
  updateBlogDate: updateBlogDateService,
  getTopNReadingVlomueBlogs: getTopNReadingVlomueBlogsService,
} = blogService;

class BlogController {
  // 根据类型进行分类
  getBlogs: Middleware = async (ctx, next) => {
    const type = ctx.query.type as string | undefined;
    const from = ctx.query.from as string | undefined;
    let ps = parseInt(ctx.query.ps as string);
    let pn = parseInt(ctx.query.pn as string);
    ps = ps == null || Number.isNaN(ps) ? 10 : ps;
    pn = pn == null || Number.isNaN(pn) ? 1 : pn;
    if (from === "cms") {
      ps = 999;
    }
    let cards: BlogForJSON[] | string | Buffer;
    let hasNext: boolean;
    try {
      if (type && type in BlogType) {
        cards = await getBlogsService(type as keyof typeof BlogType, ps, pn);
      } else {
        cards = await getAllBlogs(ps, pn);
      }
      hasNext = await hasNextPage(ps, pn);
    } catch (e: unknown) {
      const err = e as Error;
      return useEmit(ErrorType.InternalServerError, ctx, err, "cards 获取失败");
    }
    ctx.type = "application/json";
    ctx.body = { cards, hasNext };
    await next();
  };
  getRecommend: Middleware = async (ctx, next) => {
    const visitorId = ctx.query.visitorId as string | undefined
    if (!visitorId) {
      ctx.body = []
      return
    }
    const recommend = await getRecommendService(visitorId);
    ctx.body = recommend
    await next()
  }
  // 获取博客正文
  getBlogById: Middleware = async (ctx, next) => {
    const id = ctx.params.id as string;
    const visitorId = ctx.query.visitorId as string;
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
  // 获取topn博客
  getTopNReadingVlomueBlogs: Middleware = async (ctx, next) => {
    let n = parseInt((ctx.params.n as string) || "10");
    n = Number.isNaN(n) ? 10 : n;
    try {
      const blogs = await getTopNReadingVlomueBlogsService(n);
      ctx.body = blogs;
    } catch (e) {
      const err = e as Error;
      return useEmit(
        ErrorType.InternalServerError,
        ctx,
        err,
        "TopN cards 获取失败"
      );
    }
  };
  // 编辑博客（修改文章）
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
      logger.info("博客文章修改" + id);
    } catch (e) {
      console.log(e);
      return useEmit(
        ErrorType.InternalServerError,
        ctx,
        new Error("修改失败"),
        "修改失败"
      );
    }
  };
  // 编辑博客（博客信息）
  editBlogInfo: Middleware = async (ctx, next) => {
    const { success, msg } = validateBlog(ctx.request.body);
    if (!success) {
      return useEmit(
        ErrorType.BadRequest,
        ctx,
        new Error("客户端请求参数错误"),
        msg
      );
    }
    const blogData = ctx.request.body as Blog;
    try {
      await editBlogInfoService(blogData);
      ctx.body = "更新成功";
    } catch (e) {
      return useEmit(ErrorType.BadRequest, ctx, e as Error, "更新失败");
    }
    await next();
  };
  // 发布博客
  publishBlog: Middleware = async (ctx, next) => {
    const { success, msg } = validateBlog(ctx.request.body);
    if (!success) {
      return useEmit(
        ErrorType.BadRequest,
        ctx,
        new Error("客户端请求参数错误"),
        msg
      );
    }
    const blogData = ctx.request.body as Blog;
    try {
      await publishBlogService(blogData);
      logger.info({ msg: "发布博客", blogData });
      ctx.body = "发布成功";
    } catch (e) {
      return useEmit(
        ErrorType.BadRequest,
        ctx,
        e as Error,
        (e as Error).message
      );
    }
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

const validateBlog: (blog: Record<string, any>) => {
  success: boolean;
  msg: string;
} = (blog) => {
  let ret = { success: false, msg: "" };
  // 必须字段
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
  // 校验 tag 对象
  if (blog.tag && !(typeof blog.tag === "object")) {
    ret.msg = "blog.tag 字段必须是 { name: string; color: string } 类型";
  } else if (!blog.tag.color) {
    ret.msg = "blog.tag.color 字段是必须的";
  } else if (!blog.tag.name) {
    ret.msg = "blog.tag.name 字段是必须的";
  }
  ret.success = true;
  return ret;
};

const blogController = new BlogController();

export { blogController };
