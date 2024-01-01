package response

type User struct {
	Name     string `json:"name"   form:"name"    query:"name" `
	Email    string `json:"email"  form:"email"   query:"email" `
	Password string `json:"password"    form:"password"     query:"password" `
}

type Site struct {
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

type Search struct {
	Continent string `json:"continent" form:"continent" query:"continent" gorm:"not null;default:亚洲"`
	Country   string `json:"country" form:"country" query:"country" gorm:"not null;default:中国"`
	City      string `json:"city" form:"city" query:"city" gorm:"not null"`
	SiteName  string `json:"siteName" form:"siteName" query:"siteName" gorm:"not null"`
}

type Remark struct {
	Content string  `json:"content" form:"content" query:"content" gorm:"not null"`
	Mark    float64 `json:"mark" form:"mark" query:"mark" gorm:"not null;default:10"`
	UserId  int     `json:"userId" form:"userId" query:"userId" gorm:"not null;foreignKey"`
	SiteId  int     `json:"siteId" form:"siteId" query:"siteId" gorm:"not null;foreignKey"`
}

type PartialRemark struct {
	UserName string  `json:"userName" form:"userName" query:"userName" gorm:"not null"`
	Content  string  `json:"content" form:"content" query:"content" gorm:"not null"`
	Mark     float64 `json:"mark" form:"mark" query:"mark" gorm:"not null;default:10"`
}

type HistoryRemark struct {
	SiteName string  `json:"siteName" form:"siteName" query:"siteName" gorm:"not null"`
	Content  string  `json:"content" form:"content" query:"content" gorm:"not null"`
	Mark     float64 `json:"mark" form:"mark" query:"mark" gorm:"not null;default:10"`
}

type SUser struct {
	Id   int    `gorm:"autoIncrement;primaryKey"`
	Name string `json:"name"   form:"name"    query:"name" gorm:"unique;not null"`
}

type SSite struct {
	Id       int    `gorm:"autoIncrement;primaryKey"`
	SiteName string `json:"siteName" form:"siteName" query:"siteName" gorm:"not null"`
}

type AddRemark struct {
	UserName string  `json:"userName" form:"userName" query:"userName" `
	SiteName string  `json:"siteName" form:"siteName" query:"siteName" `
	Content  string  `json:"content" form:"content" query:"content" `
	Mark     float64 `json:"mark" form:"mark" query:"mark" `
}

type SiteRemark struct {
	SiteName string          `json:"siteName" form:"siteName" query:"siteName" `
	Average  float64         `json:"average" form:"average" query:"average" `
	TotalCnt int             `json:"totalCnt" form:"totalCnt" query:"totalCnt" `
	Remarks  []PartialRemark `json:"remarks" form:"remarks" query:"remarks" `
}

type SiteQuery struct {
	SiteName string `json:"siteName" form:"siteName" query:"siteName" `
}
