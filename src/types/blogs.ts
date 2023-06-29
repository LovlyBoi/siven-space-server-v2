// 后端的Blog类型
interface Blog {
  id: string;
  author: string;
  type: BlogType;
  title: string;
  pictures: string;
  audit: 0 | 1 | 2;
  auditMsg?: string;
  tag: {
    name: string;
    color: TagColor;
  };
  publishDate?: string;
  updateDate?: string;
}

// 发送给前端的 Blog 类型，不需要存储位置
interface BlogForJSON {
  id: string;
  author: string;
  type: BlogType;
  title: string;
  pictures: string[];
  tag: {
    name: string;
    color: TagColor;
  };
  publishDate: string;
  updateDate: string;
}

interface BlogWithAudit extends BlogForJSON {
  /**
   * 0: 审核通过
   * 1: 待审核
   * 2: 审核不通过
   */
  audit: 0 | 1 | 2;
  auditMsg?: string;
}

enum BlogType {
  "meat-dish" = 1,
  "vegetable-dish",
  "staple",
  "dessert",
  "drink",
  "soup",
}

type TagColor = "yellow" | "pink" | "green" | "indigo";

interface OutlineItem {
  anchor: string;
  depth: number;
  title: string;
}

// 大纲
type Outline = OutlineItem[];

interface ParsedHtml {
  outline: Outline;
  html: string | Buffer;
}

interface ParsedHtmlForJSON extends BlogForJSON {
  parsed: ParsedHtml;
}

export {
  Blog,
  BlogForJSON,
  BlogWithAudit,
  BlogType,
  TagColor,
  OutlineItem,
  Outline,
  ParsedHtml,
  ParsedHtmlForJSON,
};
