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

	deviceGroup := G.Group("/device", middleware.Cors(), middleware.Auth())
	deviceGroup.GET("/all", controller.GetAllDeviceHandler)
	deviceGroup.POST("/add", controller.AddDeviceHandler)
	deviceGroup.POST("/modify", controller.ModifyDeviceHandler)
	deviceGroup.POST("/delete", controller.DeleteDeviceHandler)

	messageGroup := G.Group("/message", middleware.Cors(), middleware.Auth())
	messageGroup.GET("/all", controller.GetAllMessageHandler)
}
