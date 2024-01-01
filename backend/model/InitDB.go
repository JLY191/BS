package model

import (
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB
var V = viper.New()

func InitDB() {
	connectDatabase()
	createTables()
}

func connectDatabase() {
	V.SetConfigName("config")
	V.AddConfigPath(".")
	V.SetConfigType("yaml")
	if err := V.ReadInConfig(); err != nil {
		logrus.Fatal("Can't read in DB config file, " + err.Error())
	}
	dbArgs := V.GetString("username") + ":" + V.GetString("password") +
		"@(" + V.GetString("host") + ":" + V.GetString("host_port") + ")/" + V.GetString("db_name") + "?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	DB, err = gorm.Open(mysql.Open(dbArgs), &gorm.Config{})
	if err != nil {
		logrus.Fatal("Failed to connect to database, " + err.Error())
	}
	logrus.Infoln("Success to connect to database!")
}

func createTables() {
	err := DB.AutoMigrate(&User{}, &Site{}, &Remark{})
	if err != nil {
		logrus.Info("Can't create tables automatically, " + err.Error())
	} else {
		logrus.Info("Create tables successfully.")
	}
}
