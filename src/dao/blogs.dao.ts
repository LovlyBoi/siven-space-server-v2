import { pool } from "../app/database";
import { STORE_BLOGS, GET_BLOGS_BY_TYPE, GET_ALL_BLOGS } from "./statement";
import { Blog, BlogForJSON, BlogType } from "../types";

// 存储 blog
export async function storeBlogs(blog: Blog) {
  const {
    id,
    author,
    type,
    title,
    pictures,
    tag: { name: tag_name, color: tag_color },
    cache_location,
  } = blog;
  return await pool.execute(STORE_BLOGS, [
    id,
    author,
    type,
    title,
    pictures,
    tag_name,
    tag_color,
    cache_location,
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
      pictures: blog.pictures.split(" "),
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
