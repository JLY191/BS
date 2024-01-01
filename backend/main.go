package main

import (
	"bs_backend/app"
	"bs_backend/model"
	"fmt"
	"sync"
)

var wg sync.WaitGroup

func main() {

	model.InitDB()
	wg.Add(1)
	go func() {
		defer func() {
			wg.Done()
			fmt.Println("Gin Web Server Quit!")
		}()
		app.InitWeb()
	}()
	wg.Add(1)
	go func() {
		defer func() {
			wg.Done()
			fmt.Println("Mqtt Server quit!")
		}()
		app.InitIotServer()
	}()

	wg.Wait()

}
