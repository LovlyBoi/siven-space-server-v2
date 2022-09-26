import KoaRouter from "koa-router";
import { blogController } from "../controller/blogs.controller";

const { getBlogs, getBlogById, publishBlog } = blogController;

const blogsRouter = new KoaRouter({ prefix: "/blogs" });

blogsRouter.get("/", getBlogs);

blogsRouter.get("/:id", getBlogById);

blogsRouter.post("/publish", publishBlog);

export { blogsRouter };
