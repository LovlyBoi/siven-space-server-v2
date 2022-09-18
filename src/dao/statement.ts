const INIT_DATABASE = `CREATE TABLE IF NOT EXISTS blogs (
  -- 博客id，这个是逻辑上的唯一标识
  nanoid varchar(32) PRIMARY KEY NOT NULL,
  -- 作者
  author varchar(30) NOT NULL,
  -- 文章类型
  type int NOT NULL,
  -- 文章标题
  title varchar(80) NOT NULL,
  -- 文章封面 url
  pics varchar(1020) NOT NULL,
  -- tag 名
  tag_name varchar(30),
  -- tag 颜色
  tag_color varchar(30),
  -- 存储位置
  cache_location varchar(255),
  -- 发布时间
  publish_date timestamp DEFAULT CURRENT_TIMESTAMP,
  -- 更新时间
  update_date timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  index type_index (type)
);`;

const STORE_BLOGS = `INSERT INTO blogs (
  nanoid,
  author,
  type,
  title,
  pics,
  tag_name,
  tag_color,
  cache_location
) VALUES( ?, ?, ?, ?, ?, ?, ?, ? );`;

const GET_BLOGS_BY_TYPE = `SELECT
nanoid as id,
author,
type,
title,
pics as pictures,
JSON_OBJECT("name", tag_name, "color", tag_color) as tag,
cache_location as location,
publish_date as publishDate,
update_date as updateDate
FROM
blogs
WHERE
blogs.type = ?;`;

const GET_ALL_BLOGS = `SELECT
nanoid as id,
author,
type,
title,
pics as pictures,
JSON_OBJECT("name", tag_name, "color", tag_color) as tag,
cache_location as location,
publish_date as publishDate,
update_date as updateDate
FROM
blogs;`;

const GET_BLOG_BY_ID = `SELECT
nanoid as id,
author,
type,
title,
pics as pictures,
JSON_OBJECT("name", tag_name, "color", tag_color) as tag,
cache_location as location,
publish_date as publishDate,
update_date as updateDate
FROM
blogs
WHERE
blogs.nanoid = ?;`;

export {
  INIT_DATABASE,
  STORE_BLOGS,
  GET_BLOGS_BY_TYPE,
  GET_ALL_BLOGS,
  GET_BLOG_BY_ID,
};