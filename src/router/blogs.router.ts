import KoaRouter from "koa-router";
import { blogController } from "../controller/blogs.controller";

const {
  getBlogs,
  getBlogById,
  publishBlog,
  deleteBlog,
  editBlogMarkdown,
  editBlogInfo,
} = blogController;

const blogsRouter = new KoaRouter({ prefix: "/blogs" });

blogsRouter.get("/", getBlogs);

blogsRouter.get("/:id", getBlogById);

blogsRouter.delete("/:id", deleteBlog);

blogsRouter.post("/edit/markdown/:id", editBlogMarkdown);

blogsRouter.post("/edit/blog", editBlogInfo);

blogsRouter.post("/publish", publishBlog);

export { blogsRouter };
