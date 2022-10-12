import {
  getAllBlogs,
  getBlogsByType,
  getBlogById,
  storeBlogs,
  updateBlogInfo,
  deleteBlogById,
  updateBlogDate,
} from "../dao/blogs.dao";
import {
  getHtmlById,
  getMarkdown,
  editMarkdown,
  removeCache,
} from "../utils/cache";
import { BlogType } from "../types";
import type { Blog, BlogForJSON, ParsedHtmlForJSON } from "../types";
import { logger } from "../utils/log";

class BlogsService {
  // 获取全部博客
  getAllBlogs = async (pageSize: number, pageNumber: number) => {
    let cards: BlogForJSON[];
    try {
      cards = await getAllBlogs(pageSize, pageNumber);
    } catch (e) {
      const error = e as Error;
      logger.error({ errorMessage: error.message, errorStack: error.stack });
      throw new Error("数据库读取失败");
    }
    // 取前四张图片
    return handleCardPics(cards);
  };
  // 获取笔记类型博客
  getNoteBlogs = async (pageSize: number, pageNumber: number) => {
    let cards: BlogForJSON[];
    try {
      cards = await getBlogsByType(BlogType.note, pageSize, pageNumber);
    } catch (e) {
      const error = e as Error;
      logger.error({ errorMessage: error.message, errorStack: error.stack });
      throw new Error("数据库读取失败");
    }
    // 取前四张图片
    return handleCardPics(cards);
  };
  // 获取随笔类型博客
  getEssayBlogs = async (pageSize: number, pageNumber: number) => {
    let cards: BlogForJSON[];
    try {
      cards = await getBlogsByType(BlogType.essay, pageSize, pageNumber);
    } catch (e) {
      throw new Error("数据库读取失败");
    }
    // 取前四张图片
    return handleCardPics(cards);
  };
  // 根据id获取博客
  getBlogById = async (id: string): Promise<ParsedHtmlForJSON> => {
    const blogInfo = await getBlogById(id);
    const parsed = await getHtmlById(id);
    return { parsed, ...blogInfo };
  };
  // 拿到博客markdown原文（可读流）
  getBlogMarkdown = (id: string) => getMarkdown(id);
  // 编辑博客（文章正文）
  editBlogMarkdown = async (id: string, content: string | Buffer) => {
    await editMarkdown(id, content);
    try {
      removeCache(id);
    } catch (e) {
      logger.error("移除html或outline缓存失败 " + id);
    }
  };
  // 编辑博客（信息）
  editBlogInfo = async (newBlogInfo: Blog) => updateBlogInfo(newBlogInfo);
  // 发布博客
  publishBlog = async (blog: Blog) => {
    const blogInfo = await getBlogById(blog.id);
    if (blogInfo && blogInfo.id) {
      throw new Error("这篇博客已经发布过了哦");
    }
    return storeBlogs(blog);
  };
  // 删除博客
  deleteBlog = async (id: string) => await deleteBlogById(id);
  // 更新博客日期
  updateBlogDate = async (id: string) => await updateBlogDate(id);
}

function handleCardPics(cards: BlogForJSON[], limit: number = 4) {
  cards.forEach((card) => {
    card.pictures =
      card.pictures.length > limit
        ? card.pictures.splice(0, limit)
        : card.pictures;
  });
  return cards;
}

export const blogService = new BlogsService();
