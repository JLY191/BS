package app

import (
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"os"
	"os/signal"
	"syscall"
)

var G = gin.Default()

func InitWeb() {
	// 创建信号用于等待服务端关闭信号
	sigs := make(chan os.Signal, 1)
	done := make(chan bool, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigs
		done <- true
	}()

	go func() {
		addRoutes()
		err := G.Run(":8080")
		if err != nil {
			logrus.Fatal("Can't start server!")
		}
		logrus.Info("Success to start server!")
	}()

	// 服务端等待关闭信号
	<-done
}
