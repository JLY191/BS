package model

type User struct {
	Id       int    `gorm:"autoIncrement;primaryKey"`
	Name     string `json:"name"   form:"name"    query:"name" gorm:"unique;not null"`
	Email    string `json:"email"  form:"email"   query:"email" gorm:"unique;not null"`
	Password string `json:"password"    form:"password"     query:"password" gorm:"not null"`
}

type Site struct {
	Id          int     `gorm:"autoIncrement;primaryKey"`
	Continent   string  `json:"continent" form:"continent" query:"continent" gorm:"not null;default:亚洲"`
	Country     string  `json:"country" form:"country" query:"country" gorm:"not null;default:中国"`
	City        string  `json:"city" form:"city" query:"city" gorm:"not null"`
	SiteName    string  `json:"siteName" form:"siteName" query:"siteName" gorm:"not null"`
	Description string  `json:"description" form:"description" query:"description" gorm:"not null"`
	Grade       float64 `json:"grade" form:"grade" query:"grade" gorm:"not null;default:0"`
	GradeCount  int     `json:"gradeCount" form:"gradeCount" query:"gradeCount" gorm:"not null;default:0"`
	Latitude    float64 `json:"latitude" form:"latitude" query:"latitude" gorm:"not null"`
	Longitude   float64 `json:"longitude" form:"longitude" query:"longitude" gorm:"not null"`
	OpenTime    string  `json:"openTime" form:"openTime" query:"openTime" gorm:"not null"`
	Season      string  `json:"season" form:"season" query:"season" gorm:"not null"`
	Ticket      int     `json:"ticket" form:"ticket" query:"ticket" gorm:"not null;default:0"`
	Free        bool    `json:"free" form:"free" query:"free" gorm:"not null"`
	Link        string  `json:"link" form:"link" query:"link" gorm:"not null"`
}

type Remark struct {
	Id      int     `gorm:"autoIncrement;primaryKey"`
	Content string  `json:"content" form:"content" query:"content" gorm:"not null"`
	Mark    float64 `json:"mark" form:"mark" query:"mark" gorm:"not null;default:10"`
	UserId  int     `json:"userId" form:"userId" query:"userId" gorm:"not null;foreignKey"`
	User    User    `gorm:"foreignKey:UserId"`
	SiteId  int     `json:"siteId" form:"siteId" query:"siteId" gorm:"not null;foreignKey"`
	Site    Site    `gorm:"foreignKey:SiteId"`
}

func (u *User) TableName() string {
	return "user"
}

func (s *Site) TableName() string {
	return "site"
}

func (r *Remark) TableName() string {
	return "remark"
}
