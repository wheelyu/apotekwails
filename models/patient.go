package models

import (
	"gorm.io/gorm"
)

type Patient struct {
	gorm.Model
	Code                    string  `json:"code" gorm:"type:varchar(191);uniqueIndex;not null"`
	Nik                     *string `json:"nik" gorm:"type:varchar(50);unique"`
	Name                    string  `json:"name" gorm:"not null"`
	Gender                  string  `json:"gender"`
	DateOfBirth             string  `json:"date_of_birth" gorm:"type:date"`
	Phone                   string  `json:"phone"`
	Address                 string  `json:"address"`
	BloodType               string  `json:"blood_type"`
	Allergies               string  `json:"allergies"`
	Status                  bool    `json:"status"`
	Religion                string  `json:"religion"`
	Occupation              string  `json:"occupation"`
	Emergency_contact_name  string  `json:"emergency_contact_name"`
	Emergency_contact_phone string  `json:"emergency_contact_phone"`
	Insurance_provider      string  `json:"insurance_provider"`
	Insurance_number        string  `json:"insurance_number"`
}
type CreateInput struct {
	Nik                     *string `json:"nik" gorm:"type:varchar(50);unique"`
	Name                    string  `json:"name" gorm:"not null"`
	Gender                  string  `json:"gender"`
	DateOfBirth             string  `json:"date_of_birth" gorm:"type:date"`
	Phone                   string  `json:"phone"`
	Address                 string  `json:"address"`
	BloodType               string  `json:"blood_type"`
	Allergies               string  `json:"allergies"`
	Status                  bool    `json:"status"`
	Religion                string  `json:"religion"`
	Occupation              string  `json:"occupation"`
	Emergency_contact_name  string  `json:"emergency_contact_name"`
	Emergency_contact_phone string  `json:"emergency_contact_phone"`
	Insurance_provider      string  `json:"insurance_provider"`
	Insurance_number        string  `json:"insurance_number"`
}

type PatientInput struct {
	Code                  string
	Nik                   string
	Name                  string
	Gender                string
	DateOfBirth           string
	Phone                 string
	Address               string
	BloodType             string
	Allergies             string
	Status                string
	Religion              string
	Occupation            string
	EmergencyContactName  string
	EmergencyContactPhone string
	InsuranceProvider     string
	InsuranceNumber       string
}
