import KoaRouter from "koa-router";
import { blogController } from "../controller/blogs.controller";

const { getBlogs, getBlogById, publishBlog, deleteBlog, editBlogMarkdown } =
  blogController;

const blogsRouter = new KoaRouter({ prefix: "/blogs" });

blogsRouter.get("/", getBlogs);

blogsRouter.get("/:id", getBlogById);

blogsRouter.delete("/:id", deleteBlog);

blogsRouter.post("/edit/:id", editBlogMarkdown);

blogsRouter.post("/publish", publishBlog);

export { blogsRouter };
