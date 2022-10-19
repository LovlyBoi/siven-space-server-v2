# 后端服务架构

前台服务和后台管理服务是否要分开？

不分开。使用 prefix 区分。

/cms/xxx 表示后台管理接口。

## 博客模块

博客正文以 HTML 格式存储在 指定缓存目录（可配置） 下（需要每次迭代后端版本的时候不被迭代掉）。

修正：倾向 MD 存储，因为可能会有编辑操作。但是 MD 存储涉及转换速度问题（不能每次请求都现转 HTML），需要设计缓存系统。

博客需要解析出大纲（后端解析，使用markdown）+ HTML（带着id）。

博客可能会比较大（几万字），可能需要考虑怎么优化。

### 缓存

缓存目录可配置：

```
# .env
# 项目信息
APP_NAME=Siven space server
APP_PORT=12345

# 数据库
DB_NAME=null
DB_USER=null
DB_PASS=null
DB_HOST=null
DB_PORT=null

# 缓存目录，相对路径或者绝对路径，最好在当前目录外，保证服务迭代时不会丢失
CACHE_DIR=./.siven-cache
```

配置的缓存目录是第二优先级的（第一优先级是内部传入的，为了防止一些边缘情况）。

上传的 md 文件名换成 nano id（21位）

### 博客表

blog

字段：作者、发布时间、更新时间、文章类型、标题、图片url、tag名、tag颜色、nanoID（来进行文章标记，不使用自增id，会暴露文章数量）。

#### 增删改查

增加：

在 CMS 系统上发布

删除：

在 CMS 系统上删除

修改：

在 CMS 系统上修改

## 数据监控模块

### Daily Visits / Monthly Visits

#### 页面访问量

每次进入，服务器分发一个 visitor_id，客户端存进sessionstorage中，来标记用户行为。

每天，服务器会创建一张 visitor 表，保存分发的 visitor 数量。

可以通过 sessionStorage 和 window.onbeforeunload 事件来判断用户是否完全退出（Pinia 初始化，让 active_tab 个数加一，一个页面卸载，让这个数值减一。减到 0 表示当前是完全退出，生命周期结束）。

- visitor_id
- from_ip
- dist_time
- leave_time

每个月末设置定时任务来自己创建一个 MAU 表（或者建一个年表，适合月度只考虑活跃用户数，没有其他字段）。

#### 文章访问量

来判断哪篇文章更受欢迎。

- 





