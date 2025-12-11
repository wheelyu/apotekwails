package backend

import (
	"apotekApp/database"
	"apotekApp/models"
	"bytes"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"

	"github.com/xuri/excelize/v2"
)

type ExcelService struct{}

func (p *ExcelService) ImportPatientsFromExcel(filePath string) error {
	f, err := excelize.OpenFile(filePath)
	if err != nil {
		return errors.New("gagal membuka file excel")
	}

	sheet := f.GetSheetList()[0]
	rows, err := f.GetRows(sheet)
	if err != nil {
		return errors.New("gagal membaca sheet excel")
	}

	if len(rows) < 2 {
		return errors.New("file excel tidak berisi data pasien")
	}

	var patients []models.Patient

	for i := 1; i < len(rows); i++ {
		row := rows[i]

		// pastikan panjang minimal 16 kolom
		for len(row) < 16 {
			row = append(row, "")
		}

		// konversi status string → bool
		status := false
		if row[9] == "1" || row[9] == "true" || row[9] == "TRUE" {
			status = true
		}

		patient := models.Patient{
			Code:                    row[0],
			Nik:                     toPtr(row[1]),
			Name:                    row[2],
			Gender:                  row[3],
			DateOfBirth:             row[4],
			Phone:                   row[5],
			Address:                 row[6],
			BloodType:               row[7],
			Allergies:               row[8],
			Status:                  status, // FIXED ✔️
			Religion:                row[10],
			Occupation:              row[11],
			Emergency_contact_name:  row[12],
			Emergency_contact_phone: row[13],
			Insurance_provider:      row[14],
			Insurance_number:        row[15],
		}

		patients = append(patients, patient)
	}

	// BULK INSERT
	if err := database.DB.Create(&patients).Error; err != nil {
		return fmt.Errorf("gagal menyimpan data pasien: %v", err)
	}

	return nil
}

// ImportPatientsFromExcelBase64 menerima nama file dan content base64 (tanpa prefix data:)
func (s *ExcelService) ImportPatientsFromExcelBase64(filename string, b64 string) error {
	if strings.TrimSpace(b64) == "" {
		return errors.New("file kosong")
	}

	data, err := base64.StdEncoding.DecodeString(b64)
	if err != nil {
		return errors.New("invalid base64 data")
	}

	f, err := excelize.OpenReader(bytes.NewReader(data))
	if err != nil {
		return fmt.Errorf("gagal membuka file excel: %v", err)
	}
	defer f.Close()

	sheet := f.GetSheetList()[0]
	rows, err := f.GetRows(sheet)
	if err != nil {
		return errors.New("gagal membaca sheet excel")
	}

	if len(rows) < 2 {
		return errors.New("file excel tidak berisi data pasien")
	}

	// Transaction untuk mempercepat & safe
	tx := database.DB.Begin()

	// speed mode
	tx.Exec("SET autocommit=0")
	tx.Exec("SET unique_checks=0")
	tx.Exec("SET foreign_key_checks=0")

	batchSize := 1000
	var batch []models.Patient

	for i := 1; i < len(rows); i++ {
		row := rows[i]

		for len(row) < 16 {
			row = append(row, "")
		}

		status := false
		if row[9] == "1" || strings.EqualFold(row[9], "true") || strings.EqualFold(row[9], "active") {
			status = true
		}

		if row[3] == "L" || strings.EqualFold(row[3], "laki-laki") {
			row[3] = "Laki-laki"
		}
		if row[3] == "P" || strings.EqualFold(row[3], "perempuan") {
			row[3] = "Perempuan"
		}

		p := models.Patient{
			Code:                    row[0],
			Nik:                     toPtr(row[1]),
			Name:                    row[2],
			Gender:                  row[3],
			DateOfBirth:             row[4],
			Phone:                   row[5],
			Address:                 row[6],
			BloodType:               row[7],
			Allergies:               row[8],
			Status:                  status,
			Religion:                row[10],
			Occupation:              row[11],
			Emergency_contact_name:  row[12],
			Emergency_contact_phone: row[13],
			Insurance_provider:      row[14],
			Insurance_number:        row[15],
		}

		batch = append(batch, p)

		if len(batch) >= batchSize {
			if err := tx.Create(&batch).Error; err != nil {
				tx.Rollback()
				return fmt.Errorf("gagal import batch data di baris %d: %v", i+1, err)
			}
			batch = []models.Patient{}
		}
	}

	// simpan sisa batch
	if len(batch) > 0 {
		if err := tx.Create(&batch).Error; err != nil {
			tx.Rollback()
			return fmt.Errorf("gagal import batch terakhir: %v", err)
		}
	}

	// restore rules
	tx.Exec("SET unique_checks=1")
	tx.Exec("SET foreign_key_checks=1")
	tx.Commit()

	return nil
}
