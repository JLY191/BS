package controller

import (
	"bs_backend/app/response"
	"bs_backend/model"
	"bs_backend/utils"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"net/http"
	"time"
)

func PingHandler(c *gin.Context) {
	response.MyResponse(c, http.StatusOK, "Pong!", nil)
}

func RegisterHandler(c *gin.Context) {
	u := response.User{}
	err := c.BindJSON(&u)
	if err != nil {
		response.MyResponse(c, http.StatusPreconditionFailed, "Bind input fail, "+err.Error(), nil)
		return
	}
	mu := model.User{
		Name:     u.Name,
		Email:    u.Email,
		Password: utils.GetHashPwd(u.Password),
	}
	test := model.User{}
	model.DB.Table("user").Where("name = ?", mu.Name).Find(&test)
	if test.Id != 0 {
		response.MyResponse(c, http.StatusPreconditionFailed, "Duplicate user name!", nil)
		return
	}
	test2 := model.User{}
	model.DB.Table("user").Where("email = ?", mu.Email).Find(&test2)
	if test2.Id != 0 {
		response.MyResponse(c, http.StatusPreconditionFailed, "Duplicate email!", nil)
		return
	}
	model.DB.Table("user").Create(&mu)
	loc, _ := time.LoadLocation("Asia/Shanghai")
	r := model.Record{
		UserName: mu.Name,
		Time:     time.Now().In(loc).Format("2006-01-02 15:04:05"),
		Action:   "register",
	}
	model.DB.Table("record").Create(&r)
	response.MyResponse(c, http.StatusOK, "Register success.", nil)
}

func LoginHandler(c *gin.Context) {
	u := response.User{}
	r := u
	err := c.BindJSON(&u)
	if err != nil {
		response.MyResponse(c, http.StatusInternalServerError, "Bind input fail, "+err.Error(), nil)
		logrus.Info("Bind input fail, " + err.Error())
		return
	}
	if u.Name != "" {
		model.DB.Table("user").Where("name = ?", u.Name).Find(&r)
		if r.Password == utils.GetHashPwd(u.Password) {
			token, err := utils.GenToken(r.Name, utils.MyKey)
			if err != nil {
				response.MyResponse(c, http.StatusInternalServerError, "Generate token fail, "+err.Error(), nil)
				logrus.Info("Token generation fail, " + err.Error())
				return
			}
			c.SetCookie("bs_jly", token, 36000, "/", "127.0.0.1", false, true)
			loc, _ := time.LoadLocation("Asia/Shanghai")
			rec := model.Record{
				UserName: r.Name,
				Time:     time.Now().In(loc).Format("2006-01-02 15:04:05"),
				Action:   "login",
			}
			model.DB.Table("record").Create(&rec)
		} else {
			response.MyResponse(c, http.StatusPreconditionFailed, "User input wrong.", nil)
			return
		}
	} else {
		model.DB.Table("user").Where("email = ?", u.Email).Find(&r)
		if r.Password == utils.GetHashPwd(u.Password) {
			token, err := utils.GenToken(r.Name, utils.MyKey)
			if err != nil {
				response.MyResponse(c, http.StatusInternalServerError, "Generate token fail, "+err.Error(), nil)
				logrus.Info("Token generation fail, " + err.Error())
				return
			}
			c.SetCookie("bs_jly", token, 36000, "/", "127.0.0.1", false, true)
			loc, _ := time.LoadLocation("Asia/Shanghai")
			rec := model.Record{
				UserName: r.Name,
				Time:     time.Now().In(loc).Format("2006-01-02 15:04:05"),
				Action:   "login",
			}
			model.DB.Table("record").Create(&rec)
		} else {
			response.MyResponse(c, http.StatusPreconditionFailed, "User input wrong", nil)
			return
		}
	}
	response.MyResponse(c, http.StatusOK, "Login success.", r.Name)
}

func LogoutHandler(c *gin.Context) {
	cookie, err := c.Cookie("bs_jly")
	if err != nil {
		response.MyResponse(c, http.StatusPreconditionFailed, "No cookie, no need to logout", nil)
		return
	}
	name := utils.ParseToken(cookie)
	c.SetCookie("bs_jly", cookie, -1, "/", "127.0.0.1", false, true)
	loc, _ := time.LoadLocation("Asia/Shanghai")
	rec := model.Record{
		UserName: name,
		Time:     time.Now().In(loc).Format("2006-01-02 15:04:05"),
		Action:   "logout",
	}
	model.DB.Table("record").Create(&rec)
	response.MyResponse(c, http.StatusOK, "Logout success", nil)
}

func UserInfoHandler(c *gin.Context) {
	userName, _ := c.Get("username")
	loc, _ := time.LoadLocation("Asia/Shanghai")
	rec := model.Record{
		UserName: userName.(string),
		Time:     time.Now().In(loc).Format("2006-01-02 15:04:05"),
		Action:   "get info",
	}
	model.DB.Table("record").Create(&rec)
	var records []model.Record
	model.DB.Table("record").Where("user_name = ?", userName.(string)).Find(&records)
	var ret []response.RetRecord
	for i := 0; i < len(records); i++ {
		tmp := response.RetRecord{
			Time:   records[i].Time,
			Action: records[i].Action,
		}
		ret = append(ret, tmp)
	}
	response.MyResponse(c, http.StatusOK, "Your info: ", ret)
}

func GetAllDeviceHandler(c *gin.Context) {
	var query []model.Device
	var ret []response.Device
	model.DB.Table("device").Find(&query)
	for i := 0; i < len(query); i++ {
		tmp := response.Device{
			Name:      query[i].Name,
			Type:      query[i].Type,
			Alert:     query[i].Alert,
			ClientID:  query[i].ClientID,
			Info:      query[i].Info,
			Lat:       query[i].Lat,
			Lng:       query[i].Lng,
			Timestamp: query[i].Timestamp,
			Value:     query[i].Value,
		}
		ret = append(ret, tmp)
	}
	name, _ := c.Get("username")
	loc, _ := time.LoadLocation("Asia/Shanghai")
	rec := model.Record{
		UserName: name.(string),
		Time:     time.Now().In(loc).Format("2006-01-02 15:04:05"),
		Action:   "get all device",
	}
	model.DB.Table("record").Create(&rec)
	response.MyResponse(c, http.StatusOK, "Devices are: ", ret)
}

func AddDeviceHandler(c *gin.Context) {
	device := model.Device{}
	err := c.BindJSON(&device)
	if err != nil {
		response.MyResponse(c, http.StatusInternalServerError, "Bind input fail, "+err.Error(), nil)
		logrus.Info("Bind input fail, " + err.Error())
		return
	}
	tmp := model.Device{}
	model.DB.Table("device").Where("client_id = ?", device.ClientID).Find(&tmp)
	if tmp.ClientID != "" {
		response.MyResponse(c, http.StatusPreconditionFailed, "Device already exists.", nil)
		return
	}
	device.Info = "init"
	device.Alert = 0
	device.Timestamp = time.Now().UnixMilli()
	model.DB.Table("device").Create(&device)
	message := model.Message{
		Alert:     device.Alert,
		ClientID:  device.ClientID,
		Info:      device.Info,
		Lat:       device.Lat,
		Lng:       device.Lng,
		Timestamp: device.Timestamp,
		Value:     device.Value,
	}
	model.DB.Table("message").Create(&message)
	name, _ := c.Get("username")
	loc, _ := time.LoadLocation("Asia/Shanghai")
	rec := model.Record{
		UserName: name.(string),
		Time:     time.Now().In(loc).Format("2006-01-02 15:04:05"),
		Action:   "add device",
	}
	model.DB.Table("record").Create(&rec)
	response.MyResponse(c, http.StatusOK, "Add device success.", nil)
}

func ModifyDeviceHandler(c *gin.Context) {
	device := model.Device{}
	err := c.BindJSON(&device)
	if err != nil {
		response.MyResponse(c, http.StatusInternalServerError, "Bind input fail, "+err.Error(), nil)
		logrus.Info("Bind input fail, " + err.Error())
		return
	}
	device.Timestamp = time.Now().UnixMilli()
	model.DB.Table("device").Select("alert", "info", "lat", "lng", "timestamp", "value", "name").Where("client_id = ?", device.ClientID).Updates(&device)
	name, _ := c.Get("username")
	loc, _ := time.LoadLocation("Asia/Shanghai")
	rec := model.Record{
		UserName: name.(string),
		Time:     time.Now().In(loc).Format("2006-01-02 15:04:05"),
		Action:   "modify device",
	}
	model.DB.Table("record").Create(&rec)
	message := model.Message{
		Alert:     device.Alert,
		ClientID:  device.ClientID,
		Info:      device.Info,
		Lat:       device.Lat,
		Lng:       device.Lng,
		Timestamp: device.Timestamp,
		Value:     device.Value,
	}
	model.DB.Table("message").Create(&message)
	response.MyResponse(c, http.StatusOK, "Modify device success.", nil)
}

func DeleteDeviceHandler(c *gin.Context) {
	device := model.Device{}
	err := c.BindJSON(&device)
	if err != nil {
		response.MyResponse(c, http.StatusInternalServerError, "Bind input fail, "+err.Error(), nil)
		logrus.Info("Bind input fail, " + err.Error())
		return
	}
	model.DB.Table("device").Where("client_id = ?", device.ClientID).Delete(&device)
	message := model.Message{
		ClientID: device.ClientID,
	}
	model.DB.Table("message").Where("client_id = ?", message.ClientID).Delete(&message)
	name, _ := c.Get("username")
	loc, _ := time.LoadLocation("Asia/Shanghai")
	rec := model.Record{
		UserName: name.(string),
		Time:     time.Now().In(loc).Format("2006-01-02 15:04:05"),
		Action:   "delete device",
	}
	model.DB.Table("record").Create(&rec)
	response.MyResponse(c, http.StatusOK, "Delete device success.", nil)
}

func GetAllMessageHandler(c *gin.Context) {
	var messages []model.Message
	model.DB.Table("message").Where("id > 0").Find(&messages)
	name, _ := c.Get("username")
	loc, _ := time.LoadLocation("Asia/Shanghai")
	rec := model.Record{
		UserName: name.(string),
		Time:     time.Now().In(loc).Format("2006-01-02 15:04:05"),
		Action:   "get message",
	}
	model.DB.Table("record").Create(&rec)
	response.MyResponse(c, http.StatusOK, "Get message success.", messages)
}
