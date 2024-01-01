package response

type User struct {
	Name     string `json:"name"   form:"name"    query:"name" `
	Email    string `json:"email"  form:"email"   query:"email" `
	Password string `json:"password"    form:"password"     query:"password" `
}

type Device struct {
	Alert     int     `json:"alert"      form:"alert"   query:"alert"  gorm:"not null;default:0"`
	ClientID  string  `json:"clientId"   form:"clientId" query:"clientId" gorm:"not null;unique"`
	Info      string  `json:"info"       form:"info" query:"info" gorm:"not null;"`
	Lat       float64 `json:"lat"        form:"lat" query:"lat" gorm:"not null;default:0"`
	Lng       float64 `json:"lng"        form:"lng" query:"lng" gorm:"not null;default:0"`
	Timestamp int64   `json:"timestamp"  form:"timestamp" query:"timestamp" gorm:"not null"`
	Value     int     `json:"value"      form:"value" query:"value" gorm:"not null"`
}

type RetRecord struct {
	Time   string `json:"time"  form:"time"  query:"time"`
	Action string `json:"action" form:"action" query:"action"`
}
