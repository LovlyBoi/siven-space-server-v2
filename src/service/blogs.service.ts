import { readFile } from "fs/promises";
import { resolve } from "path";
import { getAllBlogs, getBlogsByType } from "../dao/blogs.dao";
import { BlogForJSON } from '../types'

class BlogsService {
  // 获取全部博客
  getAllBlogs = async () => {
    // 到时候将fs操作改为从服务器获取
    let cards: BlogForJSON[]
    try {
      cards = await getAllBlogs();
    } catch (e) {
      throw new Error('数据库读取失败')
    }
    return cards;
  };
  // 获取笔记类型博客
  getNoteBlogs = async () => {
    const cards = await readFile(resolve(__dirname, "./cards.json"));
    return cards;
  };
  // 获取随笔类型博客
  getEssayBlogs = async () => {
    const cards = await readFile(resolve(__dirname, "./cards.json"));
    return cards;
  };
}

export const blogService = new BlogsService();
