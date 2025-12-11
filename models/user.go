package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name        string
	Email       string `gorm:"unique"`
	Password    string
	Phone       string
	Gender      string `json:"gender"`
	DateOfBirth string `json:"date_of_birth" gorm:"type:date"`
	Role        string
	Token       string `gorm:"-"`
}
