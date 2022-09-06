import { mkdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { resolve, isAbsolute } from "path";
import { parseMarkDown } from "./markdown";
import type { Outline, ParsedHtml } from "./markdown";
import { nanoid } from "nanoid";

function makeId() {
  return nanoid();
}

// 初始化缓存目录
export function cacheInit(cacheDir?: string): string {
  cacheDir = cacheDir || process.env.CACHE_DIR || "../";
  process.env.CACHE_DIR = cacheDir = isAbsolute(cacheDir)
    ? cacheDir
    : resolve(process.cwd(), cacheDir);

  // 如果目录不存在，创建对应目录
  for (const subDir of ["html", "markdown", "outline", "image"]) {
    mkdirSync(resolve(cacheDir, subDir), { recursive: true });
  }

  return cacheDir;
}

export interface MarkdownFile {
  id: string;
  location: string;
  originName: string;
}

// 存储md文件，接受md文件，返回 nanoid，文件地址，文件名
export async function storeMarkDown(
  markdownString: string | Buffer,
  filename: string
): Promise<MarkdownFile> {
  const markdownDir = resolve(process.env.CACHE_DIR!, "./markdown");
  const id = makeId();
  const file: MarkdownFile = {
    id,
    location: resolve(markdownDir, id),
    originName: filename,
  };
  // try {

  // } catch (e) {
  //   console.log(e);
  //   throw new Error("MarkDown文件写入失败");
  // }
  await writeFile(
    file.location,
    typeof markdownString === "string"
      ? markdownString
      : markdownString.toString()
  );
  return file;
}

async function cacheHtml(id: string, html: string) {
  const htmlDir = resolve(process.env.CACHE_DIR!, "./html");
  try {
    await writeFile(resolve(htmlDir, id), html);
  } catch (e) {
    console.log(e);
    throw new Error("缓存 HTML 失败");
  }
}

async function cacheOutline(id: string, outline: Outline) {
  const outlineDir = resolve(process.env.CACHE_DIR!, "./outline");
  try {
    await writeFile(resolve(outlineDir, id), JSON.stringify(outline));
  } catch (e) {
    console.log(e);
    throw new Error("缓存文章大纲失败");
  }
}

export async function getHtmlById(id: string): Promise<ParsedHtml> {
  const markdownDir = resolve(process.env.CACHE_DIR!, "./markdown");

  const mdBuffer = await readFile(resolve(markdownDir, id));
  const { outline, html } = parseMarkDown(mdBuffer);

  // 尝试缓存结果，不阻塞正常返回
  cacheHtml(id, html);
  cacheOutline(id, outline);
  return { outline, html };
}
