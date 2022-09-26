import { pool } from "../app/database";
import {
  STORE_BLOGS,
  GET_BLOGS_BY_TYPE,
  GET_ALL_BLOGS,
  GET_BLOG_BY_ID,
} from "./statement";
import type { Blog, BlogForJSON, BlogType } from "../types";

// 存储 blog
export async function storeBlogs(blog: Blog) {
  const { id, author, type, title, tag, pictures } = blog;
  return await pool.execute(STORE_BLOGS, [
    id,
    author,
    type,
    title,
    pictures,
    tag.name,
    tag.color,
  ]);
}

function Blog2BlogForJSON(blogs: Blog[]): BlogForJSON[] {
  const ret: BlogForJSON[] = [];
  for (const blog of blogs) {
    ret.push({
      id: blog.id,
      author: blog.author,
      type: blog.type,
      title: blog.title,
      pictures: blog.pictures ? blog.pictures.split(" ") : [],
      tag: { name: blog.tag.name, color: blog.tag.color },
      publishDate: blog.publishDate!,
      updateDate: blog.updateDate!,
    });
  }
  return ret;
}

// 通过 type 获取 blog
export async function getBlogsByType(type: BlogType): Promise<BlogForJSON[]> {
  let result;
  try {
    result = await pool.execute(GET_BLOGS_BY_TYPE, [type]);
  } catch (e) {
    console.log("获取blog失败", e);
    throw e;
  }
  result = result[0] as unknown as Blog[];
  return Blog2BlogForJSON(result);
}

// 通过 type 获取 blog
export async function getAllBlogs(): Promise<BlogForJSON[]> {
  let result;
  try {
    result = await pool.execute(GET_ALL_BLOGS);
  } catch (e) {
    console.log("获取blog失败", e);
    throw e;
  }
  result = result[0] as unknown as Blog[];
  return Blog2BlogForJSON(result);
}

// 通过 id 拿到具体的博客信息
export async function getBlogById(id: string): Promise<BlogForJSON> {
  const result = await pool.execute(GET_BLOG_BY_ID, [id]);
  return (result[0] as unknown[])[0] as BlogForJSON;
}
