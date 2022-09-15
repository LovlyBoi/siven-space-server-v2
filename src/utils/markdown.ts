// import { readFile } from "fs/promises";
// import { resolve } from "path";
import { marked, Slugger } from "marked";

import hljs from "highlight.js";
import type { ParsedHtml, Outline } from "../types";

export function parseMarkDown(markdownString: string | Buffer): ParsedHtml {
  markdownString =
    typeof markdownString === "string"
      ? markdownString
      : markdownString.toString();
  const outline: Outline = [];
  // slugger 是marked内部生成id的工具，使用同样的工具获得相同的id
  const slugger = new Slugger();
  const html = marked.parse(markdownString, {
    headerIds: true,
    walkTokens(token) {
      if (token.type === "heading") {
        outline.push({
          anchor: "#" + slugger.slug(token.text),
          depth: token.depth,
          title: token.text,
        });
      }
    },
    // langPrefix: 'marked-',
    // 直接在服务端生成 highlight
    highlight(code, lang) {
      if (lang === "vue") lang = "html";
      const html: string = hljs.highlight(code, { language: lang }).value;
      return html;
    },
  });

  return {
    html,
    outline,
  };
}

// readFile(resolve(__dirname, "./vite")).then((val) => {
//   console.log(parseMarkDown(val))
//   // parseMarkDown(val)
// })
