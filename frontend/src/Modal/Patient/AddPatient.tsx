import ModalLayout from "@/components/ModalLayout";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Toast } from "@/alert/toast";
import { CreatePatient } from "../../../wailsjs/go/backend/PatientService";
import { models } from "../../../wailsjs/go/models";
interface Props {
    onClose: () => void
    fetchData: () => void
}
  interface ValidationErrors {
    nik?: string
    name?: string
    gender?: string
    date_of_birth?: string

}
interface Data {
    nik: string
    name: string
    gender: string
    date_of_birth: string
    phone: string
    address: string
    blood_type: string
    allergies: string
    status: boolean
    religion: string
    occupation: string
    emergency_contact_name: string
    emergency_contact_phone: string
    insurance_provider: string
    insurance_number: string
}
const AddPatient: React.FC<Props> = ({ onClose, fetchData }) => {
    const [showOptional, setShowOptional] = useState(false);
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [formData, setFormData] = useState<Data>({
    nik: "",
    name: "",
    gender: "",
    date_of_birth: "",
    phone: "",
    address: "",
    blood_type: "",
    allergies: "",
    status: true,
    religion: "",
    occupation: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    insurance_provider: "",
    insurance_number: "",
    
    });
    const validateField = (name: string, value: any): string => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'nama harus diisi';
                return '';
            case 'gender':
                if (!value.trim()) return 'gender harus diisi';
                return '';
            case 'date_of_birth':
                if (!value.trim()) return 'tanggal lahir harus diisi';
                return '';
            default:
                return '';
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
     // Clear error when user starts typing
            if (errors[name as keyof ValidationErrors]) {
                setErrors(prev => ({
                    ...prev,
                    [name]: ''
                }));
            }
    };
    const validateForm = (): boolean => {
            const newErrors: ValidationErrors = {};
            let isValid = true;
    
            // Validate each field
            Object.keys(formData).forEach((key) => {
                const error = validateField(key, formData[key as keyof Data]);
                if (error) {
                    newErrors[key as keyof ValidationErrors] = error;
                    isValid = false;
                }
            });
    
            setErrors(newErrors);
            return isValid;
        };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
        Toast.fire({
            icon: 'error',
            title: 'Data belum lengkap',
        });
        return;
    }

    try {

        // Format tanggal (ISO → YYYY-MM-DD)
        const formattedDate = formData.date_of_birth
            ? formData.date_of_birth.split("T")[0]
            : null;

        // Buat input sesuai model Wails
        const input = models.CreateInput.createFrom({
            ...formData,
            date_of_birth: formattedDate,
        });

        await CreatePatient(input);

        Toast.fire({
            icon: 'success',
            title: 'Data pasien berhasil ditambahkan',
        });

        onClose();
        fetchData();

    } catch (error: any) {
        console.log(error);
        Toast.fire({
            icon: 'error',
            title: error,
        });
    }
};

    return (
        <ModalLayout size="lg" open={true} onClose={onClose} title="Tambah Pasien Baru" subtitle="Masukkan Data Pasien" 
        footer={
            <div className="flex justify-end pt-4">
                <Button type="button" onClick={handleSubmit}>Simpan Data</Button>
            </div>
        } >
            <form className="space-y-4 ">
            <div className="md:grid md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="nik">NIK</Label>
                <Input id="nik" name="nik" value={formData.nik} onChange={handleChange} placeholder="Masukkan nik pasien" required />
                {errors.nik && (
                        <p className="text-red-500 text-xs italic mt-1">{errors.nik}</p>
                )}
            </div>
            <div>
                <Label htmlFor="name">Nama</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Masukkan nama pasien" required />
                {errors.name && (
                        <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
                )}
            </div>
            <div className="md:grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="date" className="px-1">
                            Tanggal Lahir
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="w-48 justify-between font-normal"
                            >
                                {formData.date_of_birth ? new Date(formData.date_of_birth).toLocaleDateString() : "Pilih tanggal"}
                                <ChevronDownIcon />
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={new Date(formData.date_of_birth)}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                if (date) {
                                    setOpen(false);
                                    setFormData({ ...formData, date_of_birth: date.toISOString() });
                                }
                                }}
                            />
                            </PopoverContent>
                        </Popover>
                                        {errors.date_of_birth && (
                        <p className="text-red-500 text-xs italic mt-1">{errors.date_of_birth}</p>
                )}
                </div>
                <div>
                    <Label htmlFor="gender">Jenis Kelamin</Label>
                    <Select onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                            {['Laki-laki', 'Perempuan'].map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.gender && (
                        <p className="text-red-500 text-xs italic mt-1">{errors.gender}</p>
                    )}
                </div>
            </div>
            <div className="md:grid md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="bloodType">Golongan Darah</Label>
                    <Select onValueChange={(v) => setFormData({ ...formData, blood_type: v })}>
                        <SelectTrigger id="bloodType">
                            <SelectValue placeholder="Pilih golongan darah" />
                        </SelectTrigger>
                        <SelectContent>
                            {['A', 'B', 'AB', 'O', 'A+', 'B+', 'AB+', 'O+','-'].map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="phone">Nomor HP</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Masukkan nomor HP"  />
                </div>
            </div>
            </div>
           
            <div className="md:grid md:grid-cols-2 gap-4">
                <div className="">
                    <Label htmlFor="address">Alamat</Label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Masukkan alamat lengkap"
                        className="w-full rounded-md border border-slate-300 p-2"
                        required
                    />
                </div>
                <div className="">
                    <Label htmlFor="allergies">Alergi</Label>
                    <Input id="allergies" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="Masukkan alergi (jika ada)" />
                </div>
            </div>


            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowOptional(!showOptional)}>
                <p className="text-sm font-medium text-slate-600">{showOptional ? "Sembunyikan" : "Tampilkan"} data tambahan (optional)</p>
                {showOptional ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: showOptional ? "auto" : 0, opacity: showOptional ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden p-2"
                >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                    <Label htmlFor="religion">Agama</Label>
                    <Select onValueChange={(v) => setFormData({ ...formData, religion: v })}>
                        <SelectTrigger id="religion">
                            <SelectValue placeholder="Pilih agama" />
                        </SelectTrigger>
                        <SelectContent>
                            {['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu'].map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                    <div>
                        <Label htmlFor="occupation">Pekerjaan</Label>
                        <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Masukkan pekerjaan" />
                    </div>
                    <div>
                        <Label htmlFor="emergency_contact_name">Nama Kontak Darurat</Label>
                        <Input id="emergency_contact_name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} placeholder="Masukkan Nama kontak darurat" />
                    </div>
                    <div>
                        <Label htmlFor="emergency_contact_phone">Nomor Kontak Darurat</Label>
                        <Input id="emergency_contact_phone" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} placeholder="Masukkan Nomor kontak darurat" />
                    </div>
                    <div >
                        <Label htmlFor="insurance_provider">Asuransi Kesehatan</Label>
                        <Input id="insurance_provider" name="insurance_provider" value={formData.insurance_provider} onChange={handleChange} placeholder="Masukkan nama asuransi" />
                    </div>
                    <div >
                        <Label htmlFor="insurance">Nomor Asuransi</Label>
                        <Input id="insurance" name="insurance" value={formData.insurance_number} onChange={handleChange} placeholder="Masukkan nomor asuransi" />
                    </div>
                </div>
            </motion.div>


            
            </form>
        </ModalLayout>
    );
};

export default AddPatient;