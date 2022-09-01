import type { Middleware, ParameterizedContext } from "koa";
import { resolve } from "path";
import { promises as fs } from "fs";

class BlogController {
  // 获取全部博客
  getAllBlogs = async (ctx: ParameterizedContext) => {
    const cards = await fs.readFile(resolve(__dirname, "./cards.json"));
    ctx.type = "application/json";
    ctx.body = cards;
  };
  // 获取笔记类型博客
  getNoteBlogs = async (ctx: ParameterizedContext) => {
    const cards = await fs.readFile(resolve(__dirname, "./cards.json"));
    ctx.type = "application/json";
    ctx.body = cards;
  };
  // 获取随笔类型博客
  getEssayBlogs = async (ctx: ParameterizedContext) => {
    const cards = await fs.readFile(resolve(__dirname, "./cards.json"));
    ctx.type = "application/json";
    ctx.body = cards;
  };
  // 根据类型进行分类
  getBlogs: Middleware = async (ctx, next) => {
    if (ctx.query.type === "note") {
      await this.getNoteBlogs(ctx);
    } else if (ctx.query.type === "essay") {
      await this.getEssayBlogs(ctx);
    } else {
      await this.getAllBlogs(ctx);
    }
    await next();
  };
}

const blogController = new BlogController();

export { blogController };
