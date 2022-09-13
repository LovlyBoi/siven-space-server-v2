import { readFile } from "fs/promises";
import { resolve } from "path";
import { getAllBlogs, getBlogsByType, getBlogById } from "../dao/blogs.dao";
import { getHtmlById } from "../utils/cache";
import { BlogType } from "../types";
import type { BlogForJSON, ParsedHtmlForJSON } from "../types";

class BlogsService {
  // 获取全部博客
  getAllBlogs = async () => {
    // 到时候将fs操作改为从服务器获取
    const cards = await readFile(resolve(__dirname, "./cards.json"));
    return cards;
  };
  // 获取笔记类型博客
  getNoteBlogs = async () => {
    let cards: BlogForJSON[];
    try {
      cards = await getBlogsByType(BlogType.note);
    } catch (e) {
      throw new Error("数据库读取失败");
    }
    // 取前四张图片
    return handleCardPics(cards);
  };
  // 获取随笔类型博客
  getEssayBlogs = async () => {
    let cards: BlogForJSON[];
    try {
      cards = await getBlogsByType(BlogType.essay);
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
