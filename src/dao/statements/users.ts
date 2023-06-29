// 用户表
export const INIT_USER_TABLE = `
CREATE TABLE IF NOT EXISTS users (
  \`user_id\` varchar(32) PRIMARY KEY NOT NULL,
  \`user_name\` varchar(32),
  \`password\` varchar(128),
  /* 身份：1是博主，2是管理员 */
  \`role\` tinyint DEFAULT 1,
  \`avatar\` varchar(512),
  \`create_date\` timestamp DEFAULT CURRENT_TIMESTAMP,
  \`unuse\` tinyint DEFAULT 0
);`

// 注册用户
export const CREATE_NEW_USER = `
INSERT INTO
  users (user_id, user_name, \`password\`, role, avatar)
VALUES
  (?, ?, ?, ?, ?);`

// 查看用户信息
export const GET_USER_INFO_BY_ID = `
SELECT
  user_id as id,
  user_name as userName,
  \`password\`,
  role,
  avatar,
  unuse
FROM
  users
WHERE
  users.user_id = ?;`

export const GET_USER_INFO_BY_NAME = `
SELECT
  user_id as id,
  user_name as userName,
  \`password\`,
  role,
  avatar,
  unuse
FROM
  users
WHERE
  users.user_name = ?;`

export const SEARCH_USERS_BY_ID_OR_NAME = `
SELECT
  user_id as id,
  user_name as userName,
  role,
  avatar,
  unuse
FROM
  users
WHERE
  users.user_name like ? OR users.user_id like ?;`

export const UPDATE_USER_ROLE = `
/* 更新用户身份 */
UPDATE
  users
SET
  users.role = ?
WHERE
  users.user_id = ?;`
