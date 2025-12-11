import ModalLayout from "@/components/ModalLayout";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toast } from "@/alert/toast";
import { CreateUser } from "../../../wailsjs/go/backend/UserService";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
interface Props {
    onClose: () => void
    fetchData: () => void
}
  interface ValidationErrors {
    email?: string
    password?: string
    role?: string
    name?: string
    confPassword?: string

}
interface Data {
    email: string
    password: string
    role: string
    name: string
    confPassword: string
}
const AddUser: React.FC<Props> = ({ onClose, fetchData }) => {
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [formData, setFormData] = useState<Data>({
    email: "",
    password: "",
    role: "",
    name: "",
    confPassword: "",
    });
    const validateField = (name: string, value: any): string => {
        switch (name) {
            case 'email':
                if (!value.trim()) return 'email harus diisi';
                return '';
            case 'name':
                if (!value.trim()) return 'nama harus diisi';
                return '';
            case 'password':
                if (!value.trim()) return 'password harus diisi';
                return '';
            case 'confPassword':
                if (!value.trim()) return 'password harus diisi';
                return '';
            case 'role':
                if (!value.trim()) return 'role harus diisi';
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
        if(!validateForm()){ {
            Toast.fire({
                icon: 'error',
                title: 'Data belum lengkap',
            })
            return;
        }
        }
        if(formData.password !== formData.confPassword){
            Toast.fire({
                icon: 'error',
                title: 'Password tidak sama',
            })
            return;
        }
        try{
            await CreateUser( formData.name,formData.email, formData.password, formData.role);
            Toast.fire({
                icon: 'success',
                title: 'Data pasien berhasil ditambahkan',
            })
            onClose();
            fetchData();
        }catch(error:any){
            Toast.fire({
                icon: 'error',
                title: error,
            })
        }
    };
    return (
        <ModalLayout size="lg" open={true} onClose={onClose} title="Tambah Pengguna Baru" subtitle="Masukkan Data Pengguna" 
        footer={
            <div className="flex justify-end pt-4">
                <Button type="button" onClick={handleSubmit}>Simpan Data</Button>
            </div>
        } >
            <form className="space-y-4 ">
            <div className="md:grid md:grid-cols-2 gap-4">
                <div>
                <Label htmlFor="name">Nama</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Masukkan nama pengguna" required />
                {errors.name && (
                        <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
                )}
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Masukkan email pengguna" required />
                {errors.email && (
                        <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
                )}
            </div>
            <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, role: v })}>
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                        {['admin', 'dokter', 'none'].map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.role && (
                    <p className="text-red-500 text-xs italic mt-1">{errors.role}</p>
                )}
            </div>
           
            </div>
            <div className="md:grid md:grid-cols-2 gap-4">
            <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Masukkan password Pengguna" required />
                    {errors.password && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="confPassword">Konfirmasi Password</Label>
                    <Input id="confPassword" type="password" name="confPassword" value={formData.confPassword} onChange={handleChange} placeholder="Konfirmasi Password Pengguna" required />
                    {errors.confPassword && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.confPassword}</p>
                    )}
                </div>
            </div>
            </form>
        </ModalLayout>
    );
};

export default AddUser;