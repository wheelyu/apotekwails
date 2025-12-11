import ModalLayout from "@/components/ModalLayout";
import { GetAllDoctors } from "../../../wailsjs/go/backend/DoctorService";
import { models } from "wailsjs/go/models";
import { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreateVisit } from "../../../wailsjs/go/backend/VisitService";
import { Toast } from "@/alert/toast";

interface Props {
  id: number;
  code: string;
  onClose: () => void;
  fetchData: () => void;
}

const RegistPatient: React.FC<Props> = ({ id, code, onClose, fetchData }) => {
  const [doctors, setDoctors] = useState<models.Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [symptoms, setSymptoms] = useState<string>("");

  const getDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await GetAllDoctors();
      if (response) {
        setDoctors(response);
      } else {
        console.warn("Response tidak valid:", response);
      }
    } catch (error) {
      console.error("Gagal mengambil data dokter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  // --- FUNGSI YANG DIPERBAIKI ---
  const handleSubmit = async () => {
    if (!selectedDoctor) {
      Toast.fire({
        icon: 'warning',
        title: 'Silakan pilih dokter terlebih dahulu',
      });
      return;
    }

    const selectedDoctorObject = doctors.find(
      (doctor) => doctor.ID?.toString() === selectedDoctor
    );

    if (!selectedDoctorObject) {
      console.error("Dokter yang dipilih tidak ditemukan.");
      Toast.fire({
        icon: 'error',
        title: 'Terjadi kesalahan, dokter tidak ditemukan',
      });
      return;
    }
    
    const specialization = selectedDoctorObject.specialization || "Umum";

    try {
      const response = await CreateVisit(id, selectedDoctorObject.ID, specialization, symptoms);
      if (response) {
        Toast.fire({
          icon: 'success',
          title: 'Data pasien berhasil ditambahkan',
        });
        onClose();
        fetchData();
      } else {
        console.warn("Response tidak valid:", response);
      }
    } catch (error: any) {
        console.error("Gagal membuat data kunjungan:", error);

        // Ambil isi pesan error-nya
        const errorMessage =
            error && error.message
            ? error.message
            : typeof error === "string"
            ? error
            : "Terjadi kesalahan saat membuat kunjungan";

        Toast.fire({
            icon: "error",
            title: errorMessage,
        });
        }

  };

  return (
    <ModalLayout open={true} onClose={onClose} title="Buat Antrian" subtitle={"ID Pasien: " + code}
      footer={
        <div className="flex justify-end pt-4">
          <Button type="button" onClick={handleSubmit}>Buat Antrian</Button>
        </div>
      }>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="doctor-select">Pilih Dokter</Label>
          <Select
            value={selectedDoctor}
            onValueChange={setSelectedDoctor}
            disabled={isLoading}
          >
            <SelectTrigger id="doctor-select" className="w-full">
              <SelectValue
                placeholder={isLoading ? "Memuat data dokter..." : "Pilih dokter"}
              />
            </SelectTrigger>
            <SelectContent>
              {doctors.length === 0 && !isLoading ? (
                <SelectItem value="no-doctor" disabled>
                  Tidak ada dokter tersedia
                </SelectItem>
              ) : (
                doctors.map((doctor) => (
                  <SelectItem
                    key={doctor.ID}
                    value={doctor.ID?.toString() || ""}
                  >
                    {doctor.fullname} - {doctor.specialization || "Umum"}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedDoctor && (
          <div className="text-sm text-gray-600">
            Dokter terpilih: {doctors.find(d => d.ID?.toString() === selectedDoctor)?.fullname}
          </div>
        )}
        <div className="">
          <Label htmlFor="address">Keluhan</Label>
          <textarea
            id="address"
            name="address"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Masukkan Keluhan Pasien"
            className="w-full rounded-md border border-slate-300 p-2"
            required
          />
        </div>
      </div>
    </ModalLayout>
  );
};

export default RegistPatient;