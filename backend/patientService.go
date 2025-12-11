package backend

import (
	"apotekApp/database"
	"apotekApp/models"
	"errors"
	"fmt"
	"log"
	"strings"

	"gorm.io/gorm"
)

type PatientService struct{}

// GetAllPatients mengembalikan semua data pasien dari tabel patients
// Struct untuk parameter pagination
type PaginationParams struct {
	Page     int    `json:"page"`
	PageSize int    `json:"pageSize"`
	Name     string `json:"name"`
	Address  string `json:"address"`
	Code     string `json:"code"`
	Nik      string `json:"nik"`
	Phone    string `json:"phone"`
}

// Struct untuk response pagination
type PaginatedPatients struct {
	Data          []models.Patient `json:"data"`
	Page          int              `json:"page"`
	PageSize      int              `json:"page_size"`
	TotalRows     int64            `json:"total_rows"`
	TotalAllRows  int64            `json:"total_all_rows"` // total semua data
	TotalPages    int              `json:"total_pages"`
	ActivePatient int64            `json:"activePatient"`
}

// Fungsi dengan pagination
func (p *PatientService) GetAllPatients(params PaginationParams) (*PaginatedPatients, error) {
	var patients []models.Patient
	var totalRows int64
	var totalAllRows int64
	var activePatient int64
	// Set default values
	if params.Page < 1 {
		params.Page = 1
	}
	if params.PageSize < 1 {
		params.PageSize = 10
	}
	// Hitung TOTAL SEMUA data (tanpa filter)
	if err := database.DB.Model(&models.Patient{}).Count(&totalAllRows).Error; err != nil {
		log.Println("❌ Failed to count all patients:", err)
		return nil, err
	}
	// Hitung Pasien Aktif
	if err := database.DB.Model(&models.Patient{}).Where("status = ?", true).Count(&activePatient).Error; err != nil {
		log.Println("❌ Failed to count all patients:", err)
		return nil, err
	}
	// Build query
	query := database.DB.Model(&models.Patient{})

	// Jika ada search keyword
	if params.Name != "" {
		query = query.Where("LOWER(name) LIKE LOWER(?)", "%"+params.Name+"%")
	}

	if params.Address != "" {
		query = query.Where("LOWER(address) LIKE LOWER(?)", "%"+params.Address+"%")
	}

	if params.Code != "" {
		query = query.Where("code LIKE ?", "%"+params.Code+"%")
	}

	if params.Nik != "" {
		query = query.Where("nik LIKE ?", "%"+params.Nik+"%")
	}

	if params.Phone != "" {
		query = query.Where("phone LIKE ?", "%"+params.Phone+"%")
	}

	// Hitung total data setelah filter
	if err := query.Count(&totalRows).Error; err != nil {
		log.Println("❌ Failed to count patients:", err)
		return nil, err
	}

	// Hitung offset
	offset := (params.Page - 1) * params.PageSize

	// Query dengan limit dan offset
	if err := query.
		Limit(params.PageSize).
		Offset(offset).
		Order("created_at DESC"). // urutkan dari terbaru
		Find(&patients).Error; err != nil {
		log.Println("❌ Failed to search patients:", err)
		return nil, err
	}

	// Hitung total pages
	totalPages := int(totalRows) / params.PageSize
	if int(totalRows)%params.PageSize > 0 {
		totalPages++
	}

	return &PaginatedPatients{
		Data:          patients,
		Page:          params.Page,
		PageSize:      params.PageSize,
		TotalRows:     totalRows,
		TotalAllRows:  totalAllRows, // total semua
		TotalPages:    totalPages,
		ActivePatient: activePatient,
	}, nil
}

type PatientTotal struct {
	Total           int64
	TotalVisit      int64
	TotalPatientNew int64
}

func toPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func (p *PatientService) GetTotalPatient() (PatientTotal, error) {
	var total int64
	var totalVisit int64
	var totalPatientNew int64

	// Total patient
	if err := database.DB.Model(&models.Patient{}).Count(&total).Error; err != nil {
		return PatientTotal{}, err
	}

	// Total visit hari ini
	if err := database.DB.
		Model(&models.Visit{}).
		Where("DATE(visit_date) = CURDATE()").
		Where("status NOT IN ?", []string{"Selesai", "Expired"}).
		Count(&totalVisit).Error; err != nil {
		return PatientTotal{}, err
	}
	// total new patient
	if err := database.DB.
		Model(&models.Patient{}).
		Where("DATE(created_at) = CURDATE()").
		Count(&totalPatientNew).Error; err != nil {
		return PatientTotal{}, err
	}

	return PatientTotal{
		Total:           total,
		TotalVisit:      totalVisit,
		TotalPatientNew: totalPatientNew,
	}, nil
}

func generatePatientCode(name string) (string, error) {

	prefix := strings.ToUpper(string(name[0]))

	var lastPatient models.Patient
	result := database.DB.
		Where("code LIKE ?", prefix+"%").
		Order("id DESC").
		First(&lastPatient)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return fmt.Sprintf("%s%04d", prefix, 1), nil
	}

	// Ambil angka terakhir, tapi fleksibel (tidak harus 4 digit)
	var lastNumber int
	_, err := fmt.Sscanf(lastPatient.Code, prefix+"%d", &lastNumber)
	if err != nil {
		return "", err
	}

	// Jika lastNumber < 9999 → pakai 4 digit
	// Jika sudah 10000 ke atas → otomatis jadi S10000 tanpa leading zero
	var newCode string
	if lastNumber < 9999 {
		newCode = fmt.Sprintf("%s%04d", prefix, lastNumber+1)
	} else {
		newCode = fmt.Sprintf("%s%d", prefix, lastNumber+1)
	}

	return newCode, nil
}

// CreatePatient menambahkan data pasien baru ke database
func (p *PatientService) CreatePatient(input models.CreateInput) (models.Patient, error) {

	// Cek NIK hanya jika diisi
	if *input.Nik != "" {
		var existing models.Patient
		result := database.DB.Where("nik = ?", input.Nik).First(&existing)
		if result.RowsAffected > 0 {
			return models.Patient{}, errors.New("NIK sudah terdaftar")
		}
	}

	// Generate kode otomatis
	code, err := generatePatientCode(input.Name)
	if err != nil {
		return models.Patient{}, err
	}

	patient := models.Patient{
		Code:                    code,
		Nik:                     input.Nik,
		Name:                    input.Name,
		Gender:                  input.Gender,
		DateOfBirth:             input.DateOfBirth,
		Phone:                   input.Phone,
		Address:                 input.Address,
		BloodType:               input.BloodType,
		Allergies:               input.Allergies,
		Status:                  input.Status,
		Religion:                input.Religion,
		Occupation:              input.Occupation,
		Emergency_contact_name:  input.Emergency_contact_name,
		Emergency_contact_phone: input.Emergency_contact_phone,
		Insurance_provider:      input.Insurance_provider,
		Insurance_number:        input.Insurance_number,
	}

	result := database.DB.Create(&patient)
	if result.Error != nil {
		return models.Patient{}, result.Error
	}

	return patient, nil
}

func (p *PatientService) UpdatePatient(code string, input models.CreateInput) (models.Patient, error) {
	var patient models.Patient

	// 1. Ambil pasien berdasarkan code
	result := database.DB.Where("code = ?", code).First(&patient)
	if result.Error != nil {
		return models.Patient{}, result.Error
	}

	// 2. Validasi: Jika NIK tidak kosong → cek apakah sudah digunakan pasien lain
	if *input.Nik != "" {
		var existing models.Patient
		err := database.DB.
			Where("nik = ? AND code <> ?", input.Nik, code).
			First(&existing).Error

		if err == nil {
			// Ditemukan pasien lain dengan NIK yang sama
			return models.Patient{}, errors.New("NIK sudah digunakan oleh pasien lain")
		}
		if err != gorm.ErrRecordNotFound {
			return models.Patient{}, err
		}
	}

	// 3. Update field-field pasien
	patient.Nik = input.Nik
	patient.Name = input.Name
	patient.Gender = input.Gender
	patient.DateOfBirth = input.DateOfBirth
	patient.Phone = input.Phone
	patient.Address = input.Address
	patient.BloodType = input.BloodType
	patient.Allergies = input.Allergies
	patient.Status = input.Status
	patient.Religion = input.Religion
	patient.Occupation = input.Occupation
	patient.Emergency_contact_name = input.Emergency_contact_name
	patient.Emergency_contact_phone = input.Emergency_contact_phone
	patient.Insurance_provider = input.Insurance_provider
	patient.Insurance_number = input.Insurance_number

	// 4. Simpan perubahan
	result = database.DB.Save(&patient)
	if result.Error != nil {
		return models.Patient{}, result.Error
	}

	return patient, nil
}

func (p *PatientService) GetPatientByCode(code string) (models.Patient, error) {
	var patient models.Patient
	result := database.DB.Where("code = ?", code).First(&patient)
	if result.Error != nil {
		return models.Patient{}, result.Error
	}
	return patient, nil
}

func (p *PatientService) DeletePatient(code string) error {
	var patient models.Patient
	result := database.DB.Where("code = ?", code).First(&patient)
	if result.Error != nil {
		return result.Error
	}

	result = database.DB.Delete(&patient)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
