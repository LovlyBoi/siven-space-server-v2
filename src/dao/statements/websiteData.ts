// 数据监控表语句
export const getDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
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

const getVisitorCountByDate = (year: number, month: number, date: number) => {
  return `
  /* 查询指定日期的日活数量 */
  SELECT
    COUNT(1) as count
  FROM
    visitors_${year}_${month}_${date};`;
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
    visitors_${year}_${month}_${date} (
      visitor_id,
      ip,
      country,
      region,
      city,
      longitude,
      latitude
    )
  VALUES
    (?, ?, ?, ?, ?, ?, ?);`;
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

// const CREATE_PV_RECORDS_TABLE = `
// /* pv表 */
// CREATE TABLE IF NOT EXISTS pv_records (
//   -- 年月日
//   record_date TIMESTAMP NOT NULL,
//   -- pv
//   pv INT DEFAULT 0,
//   PRIMARY KEY(record_date)
// );`;
const CREATE_PV_RECORDS_TABLE = `
/* 创建pv表 */
CREATE TABLE IF NOT EXISTS pv_records (
  -- 年月日
  record_year SMALLINT NOT NULL,
  record_month TINYINT NOT NULL,
  record_date TINYINT NOT NULL,
  -- pv
  pv INT DEFAULT 0,
  PRIMARY KEY(record_year, record_month, record_date)
);`;

// const INSERT_NEW_PV_RECORDS = `
// /* 新增一个日活记录 */
// INSERT INTO
//   pv_records (record_date, pv)
// VALUES
//   (?, ?);`;
const INSERT_NEW_PV_RECORDS = `
/* 新增一个日活记录 */
INSERT INTO
  pv_records (record_year, record_month, record_date, pv)
VALUES
  (?, ?, ?, ?);`;

const UPDATE_PV_RECORDS = `
/* 如果已经有记录了，更新记录 */
UPDATE
  pv_records
SET
  pv = ?
WHERE
  record_year = ?
  AND record_month = ?
  AND record_date = ?;`;

const COUNT_PV_RECORDS_BY_DATE = `
/* 判断日活记录在不在 */
SELECT
  COUNT(1) as records
FROM
  pv_records
WHERE
  record_year = ?
  AND record_month = ?
  AND record_date = ?;`;

const SELECT_PV_BY_PERIOD = `
/* 查询两段时间内的日活 */
SELECT
  CONCAT(
    record_year,
    '-',
    record_month,
    '-',
    record_date
  ) as date,
  pv
FROM
  pv_records A
WHERE
  DATE_FORMAT(
    CONCAT(
      A.record_year,
      '-',
      A.record_month,
      '-',
      A.record_date
    ),
    '%Y%m%d'
  ) BETWEEN DATE_FORMAT(?, '%Y%m%d')
  AND DATE_FORMAT(?, '%Y%m%d');`;

export {
  createVisitorsTable,
  createVisitTable,
  insertVisitor,
  insertVisit,
  getVisitorCountByDate,
  CREATE_PV_RECORDS_TABLE,
  COUNT_PV_RECORDS_BY_DATE,
  INSERT_NEW_PV_RECORDS,
  UPDATE_PV_RECORDS,
  SELECT_PV_BY_PERIOD,
};
