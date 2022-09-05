import { resolve } from "path";
import { promises as fs } from "fs";

class BlogsService {
  // 获取全部博客
  getAllBlogs = async () => {
    // 到时候将fs操作改为从服务器获取
    const cards = await fs.readFile(resolve(__dirname, "./cards.json"));
    return cards;
  };
  // 获取笔记类型博客
  getNoteBlogs = async () => {
    const cards = await fs.readFile(resolve(__dirname, "./cards.json"));
    return cards;
  };
  // 获取随笔类型博客
  getEssayBlogs = async () => {
    const cards = await fs.readFile(resolve(__dirname, "./cards.json"));
    return cards;
  };
}

export const blogService = new BlogsService();
