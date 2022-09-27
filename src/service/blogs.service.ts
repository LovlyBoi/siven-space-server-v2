import { readFile } from "fs/promises";
import { resolve } from "path";
import {
  getAllBlogs,
  getBlogsByType,
  getBlogById,
  storeBlogs,
} from "../dao/blogs.dao";
import { getHtmlById } from "../utils/cache";
import { BlogType } from "../types";
import type { Blog, BlogForJSON, ParsedHtmlForJSON } from "../types";

class BlogsService {
  // 获取全部博客
  getAllBlogs = async (pageSize: number, pageNumber: number) => {
    // 到时候将fs操作改为从服务器获取
    const cards = await readFile(resolve(__dirname, "./cards.json"));
    return cards;
  };
  // 获取笔记类型博客
  getNoteBlogs = async (pageSize: number, pageNumber: number) => {
    let cards: BlogForJSON[];
    try {
      cards = await getBlogsByType(BlogType.note, pageSize, pageNumber);
    } catch (e) {
      console.log(e)
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
  // 发布博客
  publishBlog = async (blog: Blog) => {
    const blogInfo = await getBlogById(blog.id);
    if (blogInfo && blogInfo.id) {
      throw new Error('这篇博客已经发布过了哦')
    }
    return storeBlogs(blog)
  };
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
