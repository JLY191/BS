# BS大程
## 运行方式
首先下载docker和docker-compose，然后运行
```bash
$ docker-compose up --build
```
多等一会儿，等到四个容器都完全运行（iot不停发消息），然后浏览器输入
`http://localhost:3000`
即可看到页面
## 提醒
如果遇到build时遇到奇奇怪怪的问题，比如I/O Timeout，继续build就行
## 感谢
hxj老师挺好的，都给我选B/S