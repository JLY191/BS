# 使用指定的 Golang 镜像版本
FROM golang:latest

# 设置国内源
RUN go env -w GO111MODULE=on
RUN go env -w GOPROXY=https://goproxy.cn,direct

# 设置工作目录
WORKDIR /app

# 复制 go.mod 和 go.sum 文件
COPY go.mod go.sum ./

# 下载依赖项
RUN go mod download

# 复制整个项目
COPY . .

# 运行 go mod tidy
RUN go mod tidy

# 构建 Go 应用程序
RUN go build -o main .

# 暴露容器的 8080 端口，以便可以从外部访问
EXPOSE 8080

# 定义容器启动时执行的命令

# 等待数据库服务准备好
CMD ["sh", "-c", "sleep 10 && ./main"]
