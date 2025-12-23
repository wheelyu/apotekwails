package database

import (
	"apotekApp/models"
	"fmt"
	"log"

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
	db.AutoMigrate(&models.User{}, &models.Doctor{}, &models.Patient{}, &models.Visit{})
	DB = db
	fmt.Println("✅ Connected to MySQL successfully!")

}
