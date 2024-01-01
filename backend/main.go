package main

import (
	"bs_backend/app"
	"bs_backend/model"
)

func main() {
	model.InitDB()
	app.InitWeb()

}
