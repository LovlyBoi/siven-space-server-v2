import KoaRouter from "koa-router";
import { blogController } from "../controller/blogs.controller";

const { getBlogs } = blogController;

const blogsRouter = new KoaRouter({ prefix: "/blogs" });

blogsRouter.get("/", getBlogs);

export { blogsRouter };
