package backend

import (
	"apotekApp/database"
	"apotekApp/models"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("supersecretkey")

// Struct untuk response login
type LoginResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	User    *UserDetail `json:"user,omitempty"`
}

// Struct user detail yang dikirim ke frontend
type UserDetail struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
	Token string `json:"token"`
}

// Struct utama untuk service user
type UserService struct{}

// Fungsi login untuk Wails
func (u *UserService) Login(email, password string) LoginResponse {
	var user models.User

	// Cari user berdasarkan email
	if err := database.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return LoginResponse{Success: false, Message: "Email tidak ditemukan"}
	}

	// Cek password dengan bcrypt
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return LoginResponse{Success: false, Message: "Password salah"}
	}

	// Buat token JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return LoginResponse{Success: false, Message: "Gagal membuat token"}
	}

	// Return sukses
	return LoginResponse{
		Success: true,
		Message: "Login berhasil",
		User: &UserDetail{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
			Token: tokenString,
		},
	}
}
func (u *UserService) Logout(email string) LoginResponse {
	var user models.User
	// Cari user berdasarkan email
	if err := database.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return LoginResponse{Success: false, Message: "Email tidak ditemukan"}
	}
	// hapus token user
	user.Token = ""
	database.DB.Save(&user)
	return LoginResponse{Success: true, Message: "Logout berhasil"}
}
func (u *UserService) GetUsers() ([]models.User, error) {
	var users []models.User

	// Cari semua user
	if err := database.DB.Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

func (u *UserService) CreateUser(name, email, password, role string) (models.User, error) {
	var user models.User

	var existing models.User
	result := database.DB.Where("email = ?", email).First(&existing)
	if result.RowsAffected > 0 {
		return models.User{}, fmt.Errorf("email sudah terdaftar")
	}
	// Hash password dengan bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return models.User{}, err
	}

	// Buat user baru
	user.Name = name
	user.Email = email
	user.Password = string(hashedPassword)
	user.Role = role
	user.Gender = ""
	user.Phone = ""
	user.DateOfBirth = time.Now().Format("2006-01-02")
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	// Simpan user ke database
	if err := database.DB.Create(&user).Error; err != nil {
		return models.User{}, err
	}

	return user, nil
}
func (u *UserService) GetUserById(id uint) (models.User, error) {
	var user models.User

	if err := database.DB.Where("id = ?", id).First(&user).Error; err != nil {
		return models.User{}, err
	}

	return user, nil
}
func (u *UserService) UpdateUser(id uint, name, email, role, gender, phone, dateOfBirth string) (models.User, error) {
	var user models.User

	if err := database.DB.Where("id = ?", id).First(&user).Error; err != nil {
		return models.User{}, err
	}

	user.Name = name
	user.Email = email
	user.Role = role
	user.Gender = gender
	user.Phone = phone
	user.DateOfBirth = dateOfBirth

	if err := database.DB.Save(&user).Error; err != nil {
		return models.User{}, err
	}

	return user, nil
}
func (u *UserService) DeleteUser(id uint) error {
	var user models.User

	if err := database.DB.Where("id = ?", id).First(&user).Error; err != nil {
		return err
	}

	if err := database.DB.Delete(&user).Error; err != nil {
		return err
	}

	return nil
}
