// 后端的Blog类型
interface Blog {
  id: string;
  author: string;
  type: BlogType;
  title: string;
  pictures: string;
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
};

enum BlogType {
  "note" = 1,
  "essay" = 2,
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
  BlogType,
  TagColor,
  OutlineItem,
  Outline,
  ParsedHtml,
  ParsedHtmlForJSON,
};
