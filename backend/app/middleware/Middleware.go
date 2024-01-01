package middleware

import (
	"bs_backend/utils"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"net/http"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("PM_backend")
		if err != nil {
			logrus.Info("No token")
			c.Abort()
		}
		name := utils.ParseToken(cookie)
		c.Set("username", name)
		c.Next()
	}
}

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization") // 添加 Authorization 头

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
}
