package app

import (
	"bs_backend/app/controller"
	"bs_backend/app/middleware"
)

func addRoutes() {
	G.GET("/ping", middleware.Cors(), controller.PingHandler)

	userGroup := G.Group("/user", middleware.Cors())
	userGroup.POST("/register", controller.RegisterHandler)
	userGroup.POST("/login", controller.LoginHandler)
	userGroup.GET("/logout", controller.LogoutHandler)
	userGroup.GET("/info", middleware.Auth(), controller.UserInfoHandler)

	// deviceGroup := G.Group("/device", middleware.Cors(), middleware.Auth())
}
