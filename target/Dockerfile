FROM openjdk:8

# 设置工作目录
WORKDIR /app

# 复制
COPY . .

# 定义运行命令，增加硬等待
CMD ["sh", "-c", "sleep 40 && java -jar iotclient-1.0.0.jar"]
