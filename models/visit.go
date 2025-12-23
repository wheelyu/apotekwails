package models

import (
	"time"

	"gorm.io/gorm"
)

type Visit struct {
	gorm.Model
	PatientID   uint      `json:"patient_id"`                               // FK ke patients.id
	Patient     *Patient  `gorm:"foreignKey:PatientID" json:"patient"`      // Relasi ke Patient
	DoctorID    uint      `json:"doctor_id"`                                // FK ke doctors.id
	Doctor      *Doctor   `gorm:"foreignKey:DoctorID" json:"doctor"`        // Relasi ke Doctor
	VisitDate   time.Time `json:"visit_date"`                               // Tanggal kunjungan
	VisitTime   string    `gorm:"size:10" json:"visit_time"`                // Jam kunjungan (misal: "09:30")
	Department  string    `gorm:"size:100" json:"department"`               // Poli atau spesialisasi
	Complaint   string    `gorm:"type:text" json:"complaint"`               // Keluhan pasien
	QueueNumber int       `json:"queue_number"`                             // Nomor antrean
	Status      string    `gorm:"size:20;default:'Menunggu'" json:"status"` // Menunggu, Diperiksa, Selesai, Batal
	IsPaid      bool      `gorm:"default:false" json:"is_paid"`
}
