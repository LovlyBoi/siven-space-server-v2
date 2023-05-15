export const INIT_AUDITS_TABLE = `
/* 审核记录表 */
CREATE TABLE IF NOT EXISTS audits (
  /* 主键 */
  \`audit_id\` varchar(32) PRIMARY KEY NOT NULL,
  /* 文章id */
  \`blog_id\` varchar(32) NOT NULL,
  /* 管理员id */
  \`admin_id\` varchar(32) NOT NULL,
  /* 审核记录创建时间 */
  \`create_date\` timestamp DEFAULT CURRENT_TIMESTAMP,
  /* 审核留下的消息 */
  \`audit_msg\` varchar(512) default ""
);`

export const CREATE_AUDIT_RECORD = `
/* 创建审核记录 */
INSERT INTO
  audits (audit_id, admin_id, blog_id, audit_msg)
VALUES
(?, ?, ?, ?);`
