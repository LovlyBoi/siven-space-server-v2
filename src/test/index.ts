import { readFile } from "fs/promises";
import { resolve } from "path";
import { storeMarkDown, getHtmlById } from "../utils/cache";
import { storeBlogs } from "../dao/blogs.dao";
import { Blog, BlogType } from "../types";

readFile(resolve(__dirname, "./nuxt2")).then(async (mdString) => {
  const { id, location } = await storeMarkDown(mdString, "nuxt2");
  const blog: Blog = {
    id,
    author: "siven",
    title: "智文的 Nuxt 2 笔记",
    type: BlogType.note,
    tag: { name: "前端笔记", color: "green" },
    pictures:
      "https://images.unsplash.com/photo-1658089676978-a93fbfdac540?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60 https://images.unsplash.com/photo-1658165106193-1d8832df7fe8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
    // pictures:
    //   "https://images.unsplash.com/photo-1658089676978-a93fbfdac540?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60 https://images.unsplash.com/photo-1658165106193-1d8832df7fe8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60 https://images.unsplash.com/photo-1658156682642-cc75d80bd589?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8N3x8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60 https://images.unsplash.com/photo-1658163724548-29ef00812a54?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTB8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
    cache_location: location,
  };
  try {
    const result = await storeBlogs(blog);
    console.log("存储完成", result);
  } catch (e) {
    console.log(e);
  }
});
