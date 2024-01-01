package response

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type Response struct {
	Code    int
	Message string
	Data    any
}

func MyResponse(c *gin.Context, code int, msg string, data ...interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    code,
		Message: msg,
		Data:    data,
	})
}
