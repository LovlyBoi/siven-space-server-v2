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
      const html: string = hljs.highlight(code, {
        language: fixLanguage(lang),
        ignoreIllegals: true,
      }, true).value;
      return html;
    },
  });

  return {
    html,
    outline,
  };
}

const hljsLang = new Set(['bash', 'sh', 'zsh', 'c', 'cpp', 'c++', 'hpp', 'cc', 'h++', 'cxx', 'css', 'curl', 'dart', 'diff', 'patch', 'django', 'jinja', 'dockerfile', 'docker', 'bat', 'dos', 'cmd', 'dust', 'dst', 'excel', 'xls', 'xlsx', 'go', 'golang', 'groovy', 'xml', 'html', 'xhtml', 'rss', 'atom', 'xjb', 'xsd', 'xsl', 'plist', 'svg', 'http', 'https', 'haskell', 'hs', 'json', 'java', 'jsp', 'javascript', 'js', 'jsx', 'kotlin', 'kt', 'less', 'lisp', 'lua', 'markdown', 'md', 'mkdown', 'mkd', 'matlab', 'nginx', 'nginxconf', 'php', 'plaintext', 'txt', 'text', 'objectivec', 'mm', 'objc', 'obj-c', 'obj-c++', 'objective-c++', 'shell', 'console', 'stylus', 'styl', 'svelte', 'swift', 'typescript', 'ts', 'vbnet', 'vb', 'vim', 'yml', 'yaml'
])

function fixLanguage(lang: string) {
  lang = lang.trim().toLowerCase()
  if (lang === 'vue') {
    return 'html'
  } else if (lang === 'react' || lang === 'react-jsx') {
    return 'jsx'
  } else if (hljsLang.has(lang)) {
    return lang
  } else {
    return 'text'
  }
}
