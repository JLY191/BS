package utils

import (
	"bs_backend/model"
	"github.com/dgrijalva/jwt-go"
	"github.com/sirupsen/logrus"
)

var s = model.V.GetString("sign")
var MyKey = []byte(s) //sign

func GenToken(userName string, key []byte) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"name": userName,
	})
	return token.SignedString(key)
}

func ParseToken(tokenString string) string {
	claim, err := jwt.ParseWithClaims(tokenString, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return MyKey, nil
	})
	if err != nil {
		logrus.Info("Can't parse token!")
	}
	return claim.Claims.(jwt.MapClaims)["name"].(string)
}
