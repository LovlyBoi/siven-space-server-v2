import { pool } from "../app/database";
import {
  STORE_BLOGS,
  GET_BLOGS_BY_TYPE,
  GET_ALL_BLOGS,
  GET_BLOG_BY_ID,
  DELETE_BLOG_BY_ID,
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
export async function getBlogsByType(
  type: BlogType,
  pageSize: number,
  pageNumber: number
): Promise<BlogForJSON[]> {
  let result;
  try {
    result = await pool.execute(GET_BLOGS_BY_TYPE, [
      type,
      pageSize.toString(),
      ((pageNumber - 1) * pageSize).toString(),
    ]);
  } catch (e) {
    console.log("获取blog失败", e);
    throw e;
  }
  result = result[0] as unknown as Blog[];
  return Blog2BlogForJSON(result);
}

// 获取全部 blog
export async function getAllBlogs(
  pageSize: number,
  pageNumber: number
): Promise<BlogForJSON[]> {
  let result;
  try {
    result = await pool.execute(GET_ALL_BLOGS, [
      pageSize.toString(),
      ((pageNumber - 1) * pageSize).toString(),
    ]);
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

// 删除对应博客
export async function deleteBlogById(id: string) {
  const result = await pool.execute(DELETE_BLOG_BY_ID, [id]);
  return result[0];
}
