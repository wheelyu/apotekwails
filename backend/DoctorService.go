package backend

import (
	"apotekApp/database"
	"apotekApp/models"
	"log"
)

type DoctorService struct{}

// Ambil semua dokter
func (p *DoctorService) GetAllDoctors() []models.Doctor {
	var doctors []models.Doctor
	if err := database.DB.Find(&doctors).Error; err != nil {
		log.Println("❌ Failed to get doctors:", err)
		return []models.Doctor{}
	}
	return doctors
}
