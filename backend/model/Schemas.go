package model

type User struct {
	Id       int    `gorm:"autoIncrement;primaryKey"`
	Name     string `json:"name"   form:"name"    query:"name" gorm:"unique;not null"`
	Email    string `json:"email"  form:"email"   query:"email" gorm:"unique;not null"`
	Password string `json:"password"    form:"password"     query:"password" gorm:"not null"`
}

type Device struct {
	ID        int     `gorm:"autoIncrement;primaryKey"`
	Name      string  `json:"name"       form:"name"   query:"name"  gorm:"not null"`
	Type      int     `json:"type"       form:"type"   query:"type"  gorm:"not null;default:0"`
	Alert     int     `json:"alert"      form:"alert"   query:"alert"  gorm:"not null;default:0"`
	ClientID  string  `json:"clientId"   form:"clientId" query:"clientId" gorm:"not null;unique"`
	Info      string  `json:"info"       form:"info" query:"info" gorm:"not null;"`
	Lat       float64 `json:"lat"        form:"lat" query:"lat" gorm:"not null;default:0"`
	Lng       float64 `json:"lng"        form:"lng" query:"lng" gorm:"not null;default:0"`
	Timestamp int64   `json:"timestamp"  form:"timestamp" query:"timestamp" gorm:"not null"`
	Value     int     `json:"value"      form:"value" query:"value" gorm:"not null"`
}

type Record struct {
	Id       uint64 `gorm:"autoIncrement;primaryKey"`
	UserName string `json:"userName"  form:"userName"  query:"userName"`
	Time     string `json:"time"  form:"time"  query:"time"`
	Action   string `json:"action" form:"action" query:"action"`
}

type Message struct {
	ID        int     `gorm:"autoIncrement;primaryKey"`
	Alert     int     `json:"alert"      form:"alert"   query:"alert"  gorm:"not null;default:0"`
	ClientID  string  `json:"clientId"   form:"clientId" query:"clientId" gorm:"not null;"`
	Info      string  `json:"info"       form:"info" query:"info" gorm:"not null;"`
	Lat       float64 `json:"lat"        form:"lat" query:"lat" gorm:"not null;default:0"`
	Lng       float64 `json:"lng"        form:"lng" query:"lng" gorm:"not null;default:0"`
	Timestamp int64   `json:"timestamp"  form:"timestamp" query:"timestamp" gorm:"not null"`
	Value     int     `json:"value"      form:"value" query:"value" gorm:"not null"`
}

func (u *User) TableName() string {
	return "user"
}

func (s *Device) TableName() string {
	return "device"
}

func (r *Record) TableName() string {
	return "record"
}

func (m *Message) TableName() string {
	return "message"
}
