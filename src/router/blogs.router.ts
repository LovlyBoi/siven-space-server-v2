import KoaRouter from "koa-router";
import { blogController } from "../controller/blogs.controller";
import { checkAccessToken } from '../middleware/auth.middleware';
import { createVisitRecommend } from '../middleware/tracker.middleware';

const {
  getBlogs,
  getRecommend,
  getBlogById,
  publishBlog,
  deleteBlog,
  editBlogMarkdown,
  editBlogInfo,
  getTopNReadingVlomueBlogs,
} = blogController;

const blogsRouter = new KoaRouter({ prefix: "/blogs" });

blogsRouter.get("/", getBlogs);

blogsRouter.get("/recommend", getRecommend);

blogsRouter.post("/article/:id", getBlogById, createVisitRecommend);

blogsRouter.delete("/:id", deleteBlog);

blogsRouter.post("/edit/markdown/:id", checkAccessToken, editBlogMarkdown);

blogsRouter.post("/edit/blog", checkAccessToken, editBlogInfo);

blogsRouter.post("/publish", checkAccessToken, publishBlog);

blogsRouter.get("/top/readingVolume", getTopNReadingVlomueBlogs);

export { blogsRouter };
