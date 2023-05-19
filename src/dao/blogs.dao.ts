import { pool } from "../app/database";
import {
  STORE_BLOGS,
  GET_BLOGS_BY_TYPE,
  GET_ALL_BLOGS,
  GET_BLOG_BY_ID,
  UPDATE_BLOG_INFO,
  DELETE_BLOG_BY_ID,
  UPDATE_BLOG_UPDATE_DATE,
  INCREASE_BLOG_READING_VOLUME,
  GET_COUNT_OF_BLOGS,
  GET_TOP_N_READING_VOLUME_BLOGS,
  GET_BLOGS_BY_AUTHOR_ID,
  GET_BLOGS_TO_BE_AUDIT,
  GET_COUNT_OF_BLOGS_BY_TYPE,
  CREATE_AUDIT_RECORD,
  UPDATE_AUDIT_STATE,
} from "./statements";
import { Blog, BlogForJSON, BlogType, BlogWithAudit } from "../types";

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

function Blog2BlogWithAudit(blogs: Blog[]): BlogWithAudit[] {
  const ret: BlogWithAudit[] = [];
  for (const blog of blogs) {
    ret.push({
      id: blog.id,
      author: blog.author,
      type: blog.type,
      title: blog.title,
      audit: blog.audit,
      auditMsg: blog.auditMsg,
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

export async function getAllBlogsByAuthor(id: string) {
  const result = (
    (await pool.execute(GET_BLOGS_BY_AUTHOR_ID, [id])) as unknown[]
  )[0] as Blog[];
  return Blog2BlogWithAudit(result);
}

export async function getBlogsToBeAudit() {
  const result = (
    (await pool.execute(GET_BLOGS_TO_BE_AUDIT)) as unknown[]
  )[0] as Blog[];
  return Blog2BlogWithAudit(result);
}

// 通过 id 拿到具体的博客信息
export async function getBlogById(id: string): Promise<BlogWithAudit> {
  const result = await pool.execute(GET_BLOG_BY_ID, [id]);
  return (result[0] as unknown[])[0] as BlogWithAudit;
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
  return result[0];
}

// 博客阅读量+1
export function increaseBlogReadingVolume(id: string) {
  return pool.execute(INCREASE_BLOG_READING_VOLUME, [id]);
}

export async function getCountOfBlogs() {
  const result = (await pool.execute(GET_COUNT_OF_BLOGS)) as any[];
  return result[0][0]["COUNT(*)"] as number;
}

export async function getCountOfBlogsByType(type: string) {
  const result = (await pool.execute(GET_COUNT_OF_BLOGS_BY_TYPE, [
    type,
  ])) as any[];
  return result[0][0]["COUNT(*)"] as number;
}

// 获取top n访问量的博客
export async function getTopNReadingVlomueBlogs(n: number) {
  const result = await pool.execute(GET_TOP_N_READING_VOLUME_BLOGS, [n + ""]);
  // console.log(result[0]);
  return result[0] as any[];
}

// 创建审核记录
export async function createAuditRecord(
  auditId: string,
  adminId: string,
  blogId: string,
  auditMsg: string
) {
  const result = await pool.execute(CREATE_AUDIT_RECORD, [
    auditId,
    adminId,
    blogId,
    auditMsg,
  ]);
  return result[0];
}

// 更新审核状态
export async function updateAuditState(
  blogId: string,
  state: 0 | 1 | 2,
  auditId: string
) {
  const result = await pool.execute(UPDATE_AUDIT_STATE, [
    state,
    auditId,
    blogId,
  ]);
  return result[0];
}
