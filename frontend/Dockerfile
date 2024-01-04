# 使用指定的 Node 镜像版本
FROM node:latest

# 设置国内源
RUN npm config set registry https://registry.npm.taobao.org/

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制其他前端文件
COPY . .

# 构建前端应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动前端服务
CMD ["npm", "start"]
