import KoaRouter from "koa-router";
import { blogController } from "../controller/blogs.contrroller";

const { getBlogs } = blogController;

const blogsRouter = new KoaRouter({ prefix: "/blogs" });

// blogsRouter.get("/", async (ctx, next) => {
  // const cards = await fs.readFile(resolve(__dirname, "./cards.json"));
  // ctx.type = "application/json";
  // ctx.body = cards.toString();
  // await next();
// });

blogsRouter.get("/", getBlogs);

export { blogsRouter };
