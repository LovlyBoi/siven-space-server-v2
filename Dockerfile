FROM node:lts-alpine3.17

COPY . .

RUN rm -rf .siven_cache

RUN rm -rf node_modules

RUN npm install -g pnpm

RUN pnpm config set registry https://registry.npm.taobao.org

RUN pnpm install

RUN rm -rf siven-space-server-v2

RUN pnpm build

CMD ["node", "siven-space-server-v2/main.js"]
