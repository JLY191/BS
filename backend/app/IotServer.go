package app

import (
	"bs_backend/model"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"

	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/mochi-mqtt/server/v2/hooks/auth"
	"github.com/mochi-mqtt/server/v2/listeners"
	"github.com/mochi-mqtt/server/v2/packets"
)

type IoTMessage struct {
	Alert     int     `json:"alert"`
	ClientID  string  `json:"clientId"`
	Info      string  `json:"info"`
	Lat       float64 `json:"lat"`
	Lng       float64 `json:"lng"`
	Timestamp int64   `json:"timestamp"`
	Value     int     `json:"value"`
}

func InitIotServer() {
	// 创建信号用于等待服务端关闭信号
	sigs := make(chan os.Signal, 1)
	done := make(chan bool, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigs
		done <- true
	}()

	// 创建新的 MQTT 服务器。
	server := mqtt.New(&mqtt.Options{
		InlineClient: true,
	})

	// 允许所有连接(权限)。
	_ = server.AddHook(new(auth.AllowHook), nil)

	// 在标1883端口上创建一个 TCP 服务端。
	tcp := listeners.NewTCP("t1", ":1883", nil)
	err := server.AddListener(tcp)
	if err != nil {
		log.Fatal(err)
	}

	callbackFn := func(cl *mqtt.Client, sub packets.Subscription, pk packets.Packet) {
		// server.Log.Info("inline client received message from subscription", "client", cl.ID, "subscriptionId", sub.Identifier, "topic", pk.TopicName, "payload", string(pk.Payload))
		cleanData := strings.ReplaceAll(string(pk.Payload), "\\", "")
		// fmt.Println(cleanData)
		tmp := IoTMessage{}
		err := json.Unmarshal([]byte(cleanData), &tmp)
		if err != nil {
			fmt.Println(err)
		}
		device := model.Device{
			Alert:     tmp.Alert,
			ClientID:  tmp.ClientID,
			Info:      tmp.Info,
			Lat:       tmp.Lat,
			Lng:       tmp.Lng,
			Timestamp: tmp.Timestamp,
			Value:     tmp.Value,
		}
		query := device
		model.DB.Table("device").Where("client_id = ?", device.ClientID).Find(&query)
		if query.ID == 0 {
			device.Name = device.ClientID
			device.Type = 1
			model.DB.Table("device").Create(&device)
		} else {
			device.ID = query.ID
			model.DB.Table("device").Where("id = ?", device.ID).Updates(&device)
		}
		message := model.Message{
			Alert:     tmp.Alert,
			ClientID:  tmp.ClientID,
			Info:      tmp.Info,
			Lat:       tmp.Lat,
			Lng:       tmp.Lng,
			Timestamp: tmp.Timestamp,
			Value:     tmp.Value,
		}
		model.DB.Table("message").Create(&message)
	}
	server.Subscribe("testapp", 1, callbackFn)

	go func() {
		err := server.Serve()
		if err != nil {
			log.Fatal(err)
		}
	}()

	// 服务端等待关闭信号
	<-done
}
