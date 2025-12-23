package backend

import (
	"apotekApp/database"
	"apotekApp/models"
	"errors"
	"log"
	"time"

	"gorm.io/gorm"
)

type VisitService struct{}

func (p *VisitService) CreateVisit(patientID, doctorID uint, department, complaint string) (*models.Visit, error) {
	if patientID == 0 || doctorID == 0 || department == "" {
		return nil, errors.New("patient, doctor, and department are required")
	}

	tx := database.DB.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}

	// Cek pasien
	var patient models.Patient
	if err := tx.First(&patient, patientID).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Cek existing visit waiting
	var existingVisit models.Visit
	if err := tx.
		Where("patient_id = ? AND status NOT IN ?", patientID, []string{"Selesai", "Expired"}).
		First(&existingVisit).Error; err == nil {

		tx.Rollback()
		return nil, errors.New("pasien masih memiliki kunjungan yang belum selesai")
	}

	// Generate queue number
	var count int64
	formattedDate := time.Now().Format("2006-01-02")
	tx.Model(&models.Visit{}).
		Where("doctor_id = ? AND DATE(created_at) = ?", doctorID, formattedDate).
		Count(&count)

	queueNumber := int(count) + 1

	// Update status patient
	patient.Status = true
	if err := tx.Save(&patient).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	visit := models.Visit{
		PatientID:   patientID,
		DoctorID:    doctorID,
		Department:  department,
		Complaint:   complaint,
		QueueNumber: queueNumber,
		Status:      "Menunggu",
		VisitDate:   time.Now(),
		VisitTime:   time.Now().Format("15:04:05"),
		IsPaid:      false,
	}

	if err := tx.Create(&visit).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	tx.Commit()

	return &visit, nil
}

func (p *VisitService) ExpireOldVisits() error {
	today := time.Now().Format("2006-01-02")

	// Update semua visit dengan status waiting dan tanggal sebelum hari ini
	err := database.DB.Model(&models.Visit{}).
		Where("status = ? AND DATE(visit_date) < ?", "Menunggu", today).
		Update("status", "Expired").Error

	return err
}

func (p *VisitService) GetAllVisitsToday(date string) []models.Visit {
	var visits []models.Visit

	// Kalau tanggal kosong, pakai hari ini
	if date == "" {
		date = time.Now().Format("2006-01-02")
	}

	// Ambil visit sesuai tanggal
	if err := database.DB.
		Preload("Doctor").
		Preload("Patient").
		Where("DATE(created_at) = ? && is_paid = ?", date, false).
		Find(&visits).Error; err != nil {
		log.Println("❌ Failed to get visits by date:", err)
		return []models.Visit{}
	}

	return visits
}
func (p *VisitService) GetAllInvoiceToday(date string) []models.Visit {
	var visits []models.Visit

	// Kalau tanggal kosong, pakai hari ini
	if date == "" {
		date = time.Now().Format("2006-01-02")
	}

	// Ambil visit sesuai tanggal
	if err := database.DB.
		Preload("Doctor").
		Preload("Patient").
		Where("DATE(created_at) = ? && status = ?", date, "Selesai").
		Find(&visits).Error; err != nil {
		log.Println("❌ Failed to get invoice by date:", err)
		return []models.Visit{}
	}

	return visits
}
func (p *VisitService) UpdateQueueNumber(visitID uint, newQueueNumber int) error {
	var visit models.Visit

	// Ambil data visit yang akan diubah
	if err := database.DB.First(&visit, visitID).Error; err != nil {
		return errors.New("visit tidak ditemukan")
	}

	oldQueue := visit.QueueNumber
	doctorID := visit.DoctorID
	today := time.Now().Format("2006-01-02")

	if newQueueNumber == oldQueue {
		return errors.New("nomor antrian tidak berubah")
	}

	tx := database.DB.Begin()

	if newQueueNumber < oldQueue {
		// Geser ke bawah: pasien di antara newQueueNumber hingga oldQueue naik 1
		if err := tx.Model(&models.Visit{}).
			Where("doctor_id = ? AND DATE(created_at) = ? AND queue_number >= ? AND queue_number < ?",
				doctorID, today, newQueueNumber, oldQueue).
			Update("queue_number", gorm.Expr("queue_number + 1")).Error; err != nil {
			tx.Rollback()
			return err
		}
	} else {
		// Geser ke atas: pasien di antara oldQueue hingga newQueue turun 1
		if err := tx.Model(&models.Visit{}).
			Where("doctor_id = ? AND DATE(created_at) = ? AND queue_number <= ? AND queue_number > ?",
				doctorID, today, newQueueNumber, oldQueue).
			Update("queue_number", gorm.Expr("queue_number - 1")).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// Update nomor antrian visit yang diubah
	if err := tx.Model(&visit).Update("queue_number", newQueueNumber).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}
func (p *VisitService) UpdateVisitStatus(visitID uint, newStatus string) error {
	validStatuses := map[string]bool{
		"Menunggu":         true,
		"Sedang diperiksa": true,
		"Menunggu obat":    true,
		"Selesai":          true,
		"Dibatalkan":       true,
	}

	// Validasi status baru
	if !validStatuses[newStatus] {
		return errors.New("status tidak valid")
	}

	var visit models.Visit
	if err := database.DB.First(&visit, visitID).Error; err != nil {
		return errors.New("data visit tidak ditemukan")
	}

	// Cegah update kalau sudah selesai atau dibatalkan
	if visit.Status == "Selesai" || visit.Status == "Dibatalkan" {
		return errors.New("kunjungan sudah selesai atau dibatalkan")
	}

	visit.Status = newStatus

	if err := database.DB.Save(&visit).Error; err != nil {
		return err
	}

	return nil
}

func (p *VisitService) UpdatePatientStatus() error {
	var patients []models.Patient

	// Ambil semua patient yang statusnya masih true
	if err := database.DB.Where("status = ?", true).Find(&patients).Error; err != nil {
		return err
	}

	for _, patient := range patients {
		var lastVisit models.Visit

		err := database.DB.
			Where("patient_id = ?", patient.ID).
			Order("created_at DESC").
			First(&lastVisit).Error

		// Jika tidak punya visit sama sekali → set status false
		if err != nil {
			patient.Status = false
			database.DB.Save(&patient)
			continue
		}

		// Cek apakah terakhir visit > 30 hari
		if time.Since(lastVisit.CreatedAt) > 30*24*time.Hour {
			patient.Status = false
			if err := database.DB.Save(&patient).Error; err != nil {
				return err
			}
		}
	}

	return nil
}
