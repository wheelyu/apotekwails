package models

type Permission struct {
	ID   uint   `gorm:"primaryKey"`
	Code string `gorm:"unique"` // user.create, user.read
}
