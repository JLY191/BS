package app

import (
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

var G = gin.Default()

func InitWeb() {
	addRoutes()
	err := G.Run(":8080")
	if err != nil {
		logrus.Fatal("Can't start server!")
	}
	logrus.Info("Success to start server!")
}
