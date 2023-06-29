# 基于 Koa + Vue 3 的本地美食推荐系统的设计与实现

## 研究内容

研究基于 Koa 和 Vue 3 的 Web 应用开发。全栈使用 TypeScript 规范类型。使用 Git 版本管理，Huskey 进行提交规范。

### 前台应用

前台 app 面向用户，展示推荐页和分类。

不使用 UI 框架，支持不同客户端的设计（响应式设计，支持 电脑、平板电脑、手机 的适配），需要动画丰富，设计精美，每一个组件需要设计加载时动画和失败页面，支持跟随系统的主题颜色。

前台 app 不需要登录。使用 Vite 打包，使用 plugin-compression 对生成环境代码进行压缩，Nginx 配置后，使用打包好的 gzip 资源加速首页访问；部分依赖包使用 CDN 链接。

### 后台管理

后台管理面向管理员和创作者。允许创作者登录后对自己的文章进行管理（在线修改，编辑文章信息，删除文章）。允许管理员查看所有文章，查看网站流量数据。

使用 Naive UI 开发，编辑器使用 mavon-editor。有登录系统，使用双 token 登录验证，访问接口。

### 服务器

服务器使用 Koa.js 开发，支持：

- 上传食谱文章（Markdown），请求时编译为 HTML，编译时整理文章大纲，保存编译结果和大纲，加速下次请求的响应速度。
- 创作者编辑食谱文章，在线创作等增删改查。
- 网站数据监控。包括网站PV（页面浏览量）、用户 IP 地址追踪（Nginx 配置，获取用户连接的 ip 地址，geoip 分析 ip 地址）、文章访问量查看。
- 登录注册系统。前端 md5 提取摘要，后端 bcrypt 加盐加密。为客户端发放 token 令牌，客户端使用 access_token 访问接口，使用 refresh_token 刷新过期的 access_token，降低 token 泄露的危险。
- 静态资源按需加载。为了减少首屏的渲染压力，使用 sharpjs 按需加载图片大小，避免客户端因为图片太大导致渲染压力高。

### 优化

- 部分依赖使用 CDN 连接。
- 前端依赖分包，第三方依赖会被单独打包引入，如果没有依赖改变，这个包不会随着版本更新重新加载。
- 图片按需加载。
- 客户端强缓存。Nginx 配置 Cache-Control: max-age=36000000; 只要版本不变，所有资源包将只会被请求一次。





