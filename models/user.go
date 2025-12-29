package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name        string
	Email       string `gorm:"unique"`
	Password    string
	Roles       []Role `gorm:"many2many:user_roles;"`
	Image_url   string `json:"image_url"`
	Phone       string
	Gender      string `json:"gender"`
	DateOfBirth string `json:"date_of_birth" gorm:"type:date"`
	Token       string `gorm:"-"`
}
