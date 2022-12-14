import { pool } from "../app/database";
import {
  STORE_BLOGS,
  GET_BLOGS_BY_TYPE,
  GET_ALL_BLOGS,
  GET_BLOG_BY_ID,
  UPDATE_BLOG_INFO,
  DELETE_BLOG_BY_ID,
  UPDATE_BLOG_UPDATE_DATE,
} from "./statements";
import type { Blog, BlogForJSON, BlogType } from "../types";
import { logger } from "../utils/log";

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

// mysql 数据 --> 应用层数据
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
  const result = (
    (await pool.execute(GET_BLOGS_BY_TYPE, [
      type,
      pageSize.toString(),
      ((pageNumber - 1) * pageSize).toString(),
    ])) as unknown[]
  )[0] as Blog[];
  // result = result[0] as unknown as Blog[];
  return Blog2BlogForJSON(result);
}

// 获取全部 blog
export async function getAllBlogs(
  pageSize: number,
  pageNumber: number
): Promise<BlogForJSON[]> {
  const result = (
    (await pool.execute(GET_ALL_BLOGS, [
      pageSize.toString(),
      ((pageNumber - 1) * pageSize).toString(),
    ])) as unknown[]
  )[0] as Blog[];
  // result = result[0] as unknown as Blog[];
  return Blog2BlogForJSON(result);
}

// 通过 id 拿到具体的博客信息
export async function getBlogById(id: string): Promise<BlogForJSON> {
  const result = await pool.execute(GET_BLOG_BY_ID, [id]);
  return (result[0] as unknown[])[0] as BlogForJSON;
}

// 编辑博客信息
export async function updateBlogInfo(newBlogInfo: Blog) {
  const { id, author, type, title, tag, pictures } = newBlogInfo;
  return await pool.execute(UPDATE_BLOG_INFO, [
    author,
    type,
    title,
    pictures,
    tag.name,
    tag.color,
    id,
  ]);
}

// 删除对应博客
export async function deleteBlogById(id: string) {
  const result = await pool.execute(DELETE_BLOG_BY_ID, [id]);
  return result[0];
}

// 更新博客的 update_date
export async function updateBlogDate(id: string) {
  const result = await pool.execute(UPDATE_BLOG_UPDATE_DATE, [id]);
  return result[0]
}
