// 数据监控表语句
const getDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  return [year, month, date] as const;
};

const createVisitorsTable = () => {
  const [year, month, date] = getDate();
  return `
  /* visitors 表，每天一张表 */
  CREATE TABLE IF NOT EXISTS visitors_${year}_${month}_${date} (
    -- 对每个游客分发的唯一id
    visitor_id varchar(32) PRIMARY KEY NOT NULL,
    -- 游客的ip地址
    ip varchar(30),
    -- 游客的国家
    country varchar(20),
    -- 游客的省份
    region varchar(20),
    -- 游客的城市
    city varchar(30),
    -- 游客的经度
    longitude double(9, 6),
    -- 游客的纬度
    latitude double(9, 6),
    -- 游客id的发布时间，即游客的进入时间
    dist_time timestamp DEFAULT CURRENT_TIMESTAMP,
    -- 游客的离开时间
    leave_time timestamp DEFAULT NULL
  );`;
};

const createVisitTable = () => {
  const [year, month, date] = getDate();
  return `
  /* visit 表，记录哪些游客访问了哪些文章 */
  CREATE TABLE IF NOT EXISTS visit_${year}_${month}_${date} (
    -- 游客id
    visitor_id varchar(32) NOT NULL,
    -- 博客id
    blog_id varchar(32) NOT NULL,
    -- 访问时间
    visit_time timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(visitor_id, blog_id)
  );`;
};

const insertVisitor = () => {
  const [year, month, date] = getDate();
  return `
  /* 创建新游客 */
  INSERT INTO
    visitors_${year}_${month}_${date} (visitor_id, ip)
  VALUES
  (?, ?);`;
};

const insertVisit = () => {
  const [year, month, date] = getDate();
  return `
  /* 创建访问记录 */
  INSERT INTO
    visit_${year}_${month}_${date} (visitor_id, blog_id)
  VALUES
  (?, ?);`;
};

export { createVisitorsTable, createVisitTable, insertVisitor, insertVisit };
