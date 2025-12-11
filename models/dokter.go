package models

import "gorm.io/gorm"

type Doctor struct {
	gorm.Model
	UserID         uint   `json:"user_id"`                           // FK ke tabel users
	User           User   `gorm:"foreignKey:UserID" json:"user"`     // Relasi one-to-one
	DoctorCode     string `gorm:"size:20;unique" json:"doctor_code"` // Kode dokter unik
	Fullname       string `gorm:"size:100" json:"fullname"`
	Specialization string `gorm:"size:100" json:"specialization"`
	Gender         string `gorm:"size:20" json:"gender"`
	PhoneNumber    string `gorm:"size:20" json:"phone_number"`
	Email          string `gorm:"size:100" json:"email"`
	Address        string `gorm:"type:text" json:"address"`
	ScheduleDays   string `gorm:"size:100" json:"schedule_days"`
	StartTime      string `gorm:"size:10" json:"start_time"`
	EndTime        string `gorm:"size:10" json:"end_time"`
	Status         string `gorm:"size:20;default:'Aktif'" json:"status"`
}
