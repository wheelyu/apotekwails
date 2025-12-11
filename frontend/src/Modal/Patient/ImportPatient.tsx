import ModalLayout from "@/components/ModalLayout";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toast } from "@/alert/toast";
import { ImportPatientsFromExcel, ImportPatientsFromExcelBase64 } from "../../../wailsjs/go/backend/ExcelService";
interface Props {
    onClose: () => void;
    fetchData: () => void;
}

const ImportPatient: React.FC<Props> = ({ onClose, fetchData }) => {
    const [excelFile, setExcelFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ekstensi
        if (!file.name.endsWith(".xlsx")) {
            Toast.fire({
                icon: "error",
                title: "Format file tidak valid. Harus file .xlsx",
            });
            return;
        }

        setExcelFile(file);
    };

    const handleSubmit = async () => {
  if (!excelFile) {
    Toast.fire({ icon: "error", title: "Pilih file Excel terlebih dahulu" });
    return;
  }

  // @ts-ignore
  const filePath = (excelFile as any).path;

  try {
    if (filePath) {
      // Jika Wails menyediakan path (Windows native), panggil langsung
      await ImportPatientsFromExcel(filePath);
    } else {
      // Fallback: baca file di frontend sebagai base64 lalu kirim ke backend
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result as string;
          // result contoh: "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,AAAA..."
          const base64 = result.split(",")[1];
          await ImportPatientsFromExcelBase64(excelFile.name, base64);
        } catch (err: any) {
          console.error("Import fallback error:", err);
          Toast.fire({
            icon: "error",
            title: err?.message || "Gagal mengimpor file (fallback).",
          });
        }
      };
      reader.onerror = (err) => {
        console.error("FileReader error:", err);
        Toast.fire({ icon: "error", title: "Gagal membaca file di browser." });
      };
      reader.readAsDataURL(excelFile);
    }

    Toast.fire({ icon: "success", title: "Data pasien berhasil diimpor" });
    fetchData();
    onClose();
  } catch (err: any) {
    console.error("Import error:", err);
    Toast.fire({
      icon: "error",
      title: err?.message || "Gagal mengimpor data. Template Excel mungkin tidak sesuai.",
    });
  }
};

    return (
        <ModalLayout
            size="lg"
            open={true}
            onClose={onClose}
            title="Import Data Pasien"
            subtitle="Pilih file Excel sesuai template yang telah ditentukan"
            footer={
                <div className="flex justify-end pt-4">
                    <Button type="button" onClick={handleSubmit}>
                        Import Data
                    </Button>
                </div>
            }
        >
            <div className="space-y-4 py-4">
                <div className="flex flex-col space-y-2">
                    <Label>Pilih File Excel (.xlsx)</Label>
                    <Input
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileChange}
                    />
                </div>

                <p className="text-sm text-gray-500">
                    Pastikan format Excel sesuai template:
                    <br />
                    Code, Nik, Name, Gender, DateOfBirth, Phone, Address, BloodType, Allergies, Status, Religion, Occupation, Emergency_contact_name, Emergency_contact_phone, Insurance_provider, Insurance_number
                </p>
            </div>
        </ModalLayout>
    );
};

export default ImportPatient;
