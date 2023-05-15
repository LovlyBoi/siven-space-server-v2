import {
  getAllBlogs,
  getBlogsByType,
  getBlogById,
  storeBlogs,
  updateBlogInfo,
  deleteBlogById,
  updateBlogDate,
  increaseBlogReadingVolume,
  getCountOfBlogs,
  getCountOfBlogsByType,
  getTopNReadingVlomueBlogs,
  getAllBlogsByAuthor,
  getBlogsToBeAudit,
  createAuditRecord,
  updateAuditState,
} from "../dao/blogs.dao";
import {
  getHtmlById,
  getMarkdown,
  editMarkdown,
  removeCache,
} from "../utils/cache";
import { BlogType } from "../types";
import type {
  Blog,
  BlogForJSON,
  BlogWithAudit,
  ParsedHtmlForJSON,
  ParsedHtml,
} from "../types";
import { recommender } from "../utils/collaborativeFilter";
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
  getBlogsByAuthor = async (id: string) => {
    let cards: BlogWithAudit[];
    try {
      cards = await getAllBlogsByAuthor(id);
    } catch (e) {
      const error = e as Error;
      logger.error({ errorMessage: error.message, errorStack: error.stack });
      throw new Error("数据库读取失败");
    }
    // 取前四张图片
    return handleCardPics(cards);
  };
  hasNextPage = async (
    pageSize: number,
    pageNumber: number,
    type?: keyof typeof BlogType
  ) => {
    const curCount = pageSize * pageNumber;
    let totalCount: number;
    if (!type) {
      totalCount = await getCountOfBlogs();
    } else {
      totalCount = await getCountOfBlogsByType(type);
    }
    return curCount < totalCount;
  };
  getRecommend = async (userId: string) => {
    const recommendIds = recommender.getRecommend(userId);
    const blogsInfos = await Promise.all(
      recommendIds.map((id) => getBlogById(id))
    );
    return handleCardPics(blogsInfos);
  };
  getBlogsToBeAudit = async () => {
    let cards: BlogWithAudit[];
    try {
      cards = await getBlogsToBeAudit();
    } catch (e) {
      const error = e as Error;
      logger.error({ errorMessage: error.message, errorStack: error.stack });
      throw new Error("数据库读取失败");
    }
    // 取前四张图片
    return handleCardPics(cards);
  };
  getBlogs = async (
    type: keyof typeof BlogType,
    pageSize: number,
    pageNumber: number
  ) => {
    let cards: BlogForJSON[];
    try {
      cards = await getBlogsByType(BlogType[type], pageSize, pageNumber);
    } catch (e) {
      const error = e as Error;
      logger.error({ errorMessage: error.message, errorStack: error.stack });
      throw new Error("数据库读取失败");
    }
    // 取前四张图片
    return handleCardPics(cards);
  };
  // 获取笔记类型博客
  // getNoteBlogs = async (pageSize: number, pageNumber: number) => {
  //   let cards: BlogForJSON[];
  //   try {
  //     cards = await getBlogsByType(BlogType.note, pageSize, pageNumber);
  //   } catch (e) {
  //     const error = e as Error;
  //     logger.error({ errorMessage: error.message, errorStack: error.stack });
  //     throw new Error("数据库读取失败");
  //   }
  //   // 取前四张图片
  //   return handleCardPics(cards);
  // };
  // // 获取随笔类型博客
  // getEssayBlogs = async (pageSize: number, pageNumber: number) => {
  //   let cards: BlogForJSON[];
  //   try {
  //     cards = await getBlogsByType(BlogType.essay, pageSize, pageNumber);
  //   } catch (e) {
  //     throw new Error("数据库读取失败");
  //   }
  //   // 取前四张图片
  //   return handleCardPics(cards);
  // };
  // 获取阅读量前n的博客
  getTopNReadingVlomueBlogs = async (n: number = 10) => {
    let cards: any[];
    try {
      cards = await getTopNReadingVlomueBlogs(n);
    } catch (e) {
      const error = e as Error;
      logger.error({ errorMessage: error.message, errorStack: error.stack });
      throw new Error("数据库读取失败");
    }
    // 取前四张图片
    return handleCardPics(cards);
  };
  // 根据id获取博客
  getBlogById = async (id: string): Promise<ParsedHtmlForJSON> => {
    const [blogInfo, parsed] = await Promise.all([
      getBlogById(id),
      getHtmlById(id),
    ]);
    increaseBlogReadingVolume(id);
    return {
      parsed,
      ...blogInfo,
    };
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
  // 审核博客
  auditBlog = async (
    auditId: string,
    adminId: string,
    blogId: string,
    state: 0 | 2,
    msg?: string
  ) => {
    await createAuditRecord(auditId, adminId, blogId, msg || "");
    await updateAuditState(blogId, state, auditId);
  };
  // 将博客提交审核
  commitBlogToAudit = async (blogId: string) => {
    await updateAuditState(blogId, 1, "");
  };
}

function handleCardPics(cards: any[], limit: number = 4) {
  cards.forEach((card) => {
    if (Array.isArray(card.pictures)) {
      card.pictures =
        card.pictures.length > limit
          ? card.pictures.splice(0, limit)
          : card.pictures;
    } else {
      card.pictures = (card.pictures && card.pictures.split(" ")) || [];
    }
  });
  return cards;
}

export const blogService = new BlogsService();
