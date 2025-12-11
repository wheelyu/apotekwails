package database

import (
	"apotekApp/models"
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

type Config struct {
	Host     string `json:"host"`
	User     string `json:"user"`
	Password string `json:"password"`
	Database string `json:"database"`
	Port     int    `json:"port"`
}

func ConnectDatabase() {

	dsn := "root:@tcp(127.0.0.1:3306)/apotekdb?charset=utf8mb4&parseTime=True&loc=Local"
	fmt.Println("DSN:", dsn)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect database: %v", err)
	}

	db.AutoMigrate(&models.User{}, &models.Patient{}, &models.Doctor{}, &models.Visit{})

	// Dummy admin
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count == 0 {
		hashed, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
		hashedd, _ := bcrypt.GenerateFromPassword([]byte("Yuniati@dr77"), bcrypt.DefaultCost)
		db.Create(&models.User{
			Name:     "Admin Apotek",
			Email:    "admin@apotek.com",
			Password: string(hashed),
			Role:     "admin",
		},
		)
		db.Create(&models.User{
			Name:        "Dr. Yuniati",
			Email:       "yuniatiummuyahya@gmail.com",
			Phone:       "081234567890",
			Gender:      "Perempuan",
			DateOfBirth: "2000-01-01",
			Password:    string(hashedd),
			Role:        "superadmin",
		})
		fmt.Println("✅ Dummy user created: admin@apotek.com / 123456")
	}

	DB = db
	fmt.Println("✅ Connected to MySQL successfully!")
	seedDoctors()
}
func seedDoctors() {
	var count int64
	DB.Model(&models.Doctor{}).Count(&count)

	if count == 0 {
		doctors := []models.Doctor{
			{
				UserID:         5,
				DoctorCode:     "D001",
				Fullname:       "Dr. YUNIATI",
				Specialization: "Dokter Umum",
				Gender:         "perempuan",
				PhoneNumber:    "081234567890",
				Email:          "superadmin@apotek.com",
				Address:        "Jl. Merpati No. 10, Jakarta",
				ScheduleDays:   "Senin, Selasa, Rabu",
				StartTime:      "08:00",
				EndTime:        "16:00",
				Status:         "Aktif",
			},
		}
		if err := DB.Create(&doctors).Error; err != nil {
			log.Println("❌ Failed to insert dummy doctors:", err)
		} else {
			fmt.Println("✅ Dummy doctors created")
		}
	}
}
