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

	siteGroup := G.Group("/site", middleware.Cors())
	siteGroup.POST("/search", controller.SearchSiteHandler)
	siteGroup.POST("/get_remark", controller.GetSiteRemarkHandler)

	remarkGroup := G.Group("/remark", middleware.Cors(), middleware.Auth())
	remarkGroup.POST("/add", controller.AddRemarkHandler)
	remarkGroup.POST("/delete", controller.DeleteRemarkHandler)
	remarkGroup.POST("/modify", controller.ModifyRemarkHandler)
	remarkGroup.GET("/user", controller.GetUserHistoryRemark)
}
