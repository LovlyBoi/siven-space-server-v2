// 博客表操作语句
const INIT_BLOG_TABLE = `
/* 博客 */
CREATE TABLE IF NOT EXISTS blogs (
  -- 博客id，这个是逻辑上的唯一标识
  nanoid varchar(32) PRIMARY KEY NOT NULL,
  -- 作者
  author varchar(32) NOT NULL,
  -- 文章类型
  type int NOT NULL,
  -- 文章标题
  title varchar(80) NOT NULL,
  -- 文章封面 url
  pics varchar(1020),
  -- tag 名 'yellow' | 'pink' | 'green' | 'indigo'
  tag_name varchar(30),
  -- tag 颜色
  tag_color varchar(30),
  -- 阅读量
  reading_volume int DEFAULT 0,
  -- 发布时间
  publish_date timestamp DEFAULT CURRENT_TIMESTAMP,
  -- 更新时间
  update_date timestamp DEFAULT CURRENT_TIMESTAMP,
  -- 删除字段
  unuse tinyint DEFAULT 0,
  index type_index (type),
  index unuse_index (unuse)
);`;

const STORE_BLOGS = `INSERT INTO blogs (
  nanoid,
  author,
  type,
  title,
  pics,
  tag_name,
  tag_color
) VALUES ( ?, ?, ?, ?, ?, ?, ? );`;

const GET_BLOGS_BY_TYPE = `
/* 按 type 读取 */
SELECT
  nanoid as id,
  author,
  type,
  title,
  pics as pictures,
  JSON_OBJECT("name", tag_name, "color", tag_color) as tag,
  publish_date as publishDate,
  update_date as updateDate
FROM
  blogs
WHERE
  blogs.type = ? AND blogs.unuse = 0
ORDER BY
  update_date DESC
LIMIT
  ? OFFSET ?;`;

const GET_ALL_BLOGS = `
/* 读取全部 */
SELECT
  nanoid as id,
  author,
  type,
  title,
  pics as pictures,
  JSON_OBJECT("name", tag_name, "color", tag_color) as tag,
  publish_date as publishDate,
  update_date as updateDate
FROM
  blogs
WHERE blogs.unuse = 0
ORDER BY
  update_date DESC
LIMIT
  ? OFFSET ?;`;

const GET_BLOG_BY_ID = `
/* 按 id 读取 */
SELECT
  nanoid as id,
  author,
  type,
  title,
  pics as pictures,
  JSON_OBJECT("name", tag_name, "color", tag_color) as tag,
  publish_date as publishDate,
  update_date as updateDate
FROM
  blogs
WHERE
  blogs.nanoid = ? AND blogs.unuse = 0;`;

const UPDATE_BLOG_INFO = `
/* 编辑博客信息 */
UPDATE
  blogs
SET
  author = ?,
  type = ?,
  title = ?,
  pics = ?,
  tag_name = ?,
  tag_color = ?
WHERE
  blogs.nanoid = ?;`;

const DELETE_BLOG_BY_ID = `
/* 删除博客 */
UPDATE
  blogs
SET
  unuse = 1
WHERE
  blogs.nanoid = ?;`;

const UPDATE_BLOG_UPDATE_DATE = `
/* 更新博客更新时间 */
UPDATE
  blogs
SET
  update_date = CURRENT_TIMESTAMP
WHERE
  blogs.nanoid = ?;`;

const INCREASE_BLOG_READING_VOLUME = `
/* 博客阅读量+1 */
UPDATE
  blogs
SET
  reading_volume = reading_volume + 1
WHERE
  blogs.nanoid = ?;`;

const GET_TOP_N_READING_VOLUME_BLOGS = `
/* 获取访问量前n的博客 */
SELECT
  nanoid as id,
  author,
  type,
  title,
  pics as pictures,
  JSON_OBJECT("name", tag_name, "color", tag_color) as tag,
  reading_volume as readingVolume,
  publish_date as publishDate,
  update_date as updateDate
FROM
  blogs
WHERE
  blogs.unuse = 0
ORDER BY
  reading_volume DESC
LIMIT
  ?;`

export {
  INIT_BLOG_TABLE,
  STORE_BLOGS,
  GET_BLOGS_BY_TYPE,
  GET_ALL_BLOGS,
  GET_BLOG_BY_ID,
  DELETE_BLOG_BY_ID,
  UPDATE_BLOG_UPDATE_DATE,
  UPDATE_BLOG_INFO,
  INCREASE_BLOG_READING_VOLUME,
  GET_TOP_N_READING_VOLUME_BLOGS,
};
