import { marked } from "marked";

export interface OutlineItem {
  anchor: string;
  depth: number;
  title: string;
}

// 大纲
export type Outline = OutlineItem[];

export interface ParsedHtml {
  outline: Outline;
  html: string | Buffer;
}

export function parseMarkDown(markdownString: string | Buffer): ParsedHtml {
  markdownString =
    typeof markdownString === "string"
      ? markdownString
      : markdownString.toString();
  const outline: Outline = [];
  const html = marked.parse(markdownString, {
    headerIds: true,
    walkTokens(token) {
      if (token.type === "heading") {
        outline.push({
          anchor: "#" + token.text,
          depth: token.depth,
          title: token.text,
        });
      }
    },
  });
  return {
    html,
    outline,
  };
}
