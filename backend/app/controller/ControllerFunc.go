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
	r := model.Record{
		UserName: mu.Name,
		Time:     time.Now().Format("2006-01-02 15:04:05"),
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
	if u.Name != "" && u.Email == "" {
		model.DB.Table("user").Where("name = ?", u.Name).Find(&r)
		if r.Password == utils.GetHashPwd(u.Password) {
			token, err := utils.GenToken(r.Name, utils.MyKey)
			if err != nil {
				response.MyResponse(c, http.StatusInternalServerError, "Generate token fail, "+err.Error(), nil)
				logrus.Info("Token generation fail, " + err.Error())
				return
			}
			c.SetCookie("bs_jly", token, 36000, "/", "127.0.0.1", false, true)
			rec := model.Record{
				UserName: r.Name,
				Time:     time.Now().Format("2006-01-02 15:04:05"),
				Action:   "login",
			}
			model.DB.Table("record").Create(&rec)
		} else {
			response.MyResponse(c, http.StatusPreconditionFailed, "User input wrong.", nil)
			return
		}
	} else if u.Name == "" && u.Email != "" {
		model.DB.Table("user").Where("email = ?", u.Email).Find(&r)
		if r.Password == utils.GetHashPwd(u.Password) {
			token, err := utils.GenToken(r.Name, utils.MyKey)
			if err != nil {
				response.MyResponse(c, http.StatusInternalServerError, "Generate token fail, "+err.Error(), nil)
				logrus.Info("Token generation fail, " + err.Error())
				return
			}
			c.SetCookie("bs_jly", token, 36000, "/", "127.0.0.1", false, true)
			rec := model.Record{
				UserName: r.Name,
				Time:     time.Now().Format("2006-01-02 15:04:05"),
				Action:   "login",
			}
			model.DB.Table("record").Create(&rec)
		} else {
			response.MyResponse(c, http.StatusPreconditionFailed, "User input wrong", nil)
			return
		}
	}
	response.MyResponse(c, http.StatusOK, "Login success.", nil)
}

func LogoutHandler(c *gin.Context) {
	cookie, err := c.Cookie("bs_jly")
	if err != nil {
		response.MyResponse(c, http.StatusPreconditionFailed, "No cookie, no need to logout", nil)
		return
	}
	name := utils.ParseToken(cookie)
	c.SetCookie("bs_jly", cookie, -1, "/", "127.0.0.1", false, true)
	rec := model.Record{
		UserName: name,
		Time:     time.Now().Format("2006-01-02 15:04:05"),
		Action:   "logout",
	}
	model.DB.Table("record").Create(&rec)
	response.MyResponse(c, http.StatusOK, "Logout success", nil)
}

func UserInfoHandler(c *gin.Context) {
	userName, _ := c.Get("username")
	rec := model.Record{
		UserName: userName.(string),
		Time:     time.Now().Format("2006-01-02 15:04:05"),
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
