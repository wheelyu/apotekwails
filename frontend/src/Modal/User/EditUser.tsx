import ModalLayout from "@/components/ModalLayout";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon } from "lucide-react";
import { Toast } from "@/alert/toast";
import { GetUserById, UpdateUser, DeleteUser } from "../../../wailsjs/go/backend/UserService";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"
import { useSweetAlert } from '@/alert/shadcnAlert';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
interface Props {
    id: number
    onClose: () => void
    fetchData: () => void
}
  interface ValidationErrors {
    email?: string
    role?: string
    name?: string

}
interface Data {
    email: string
    role: string
    name: string
    gender: string
    date_of_birth: string
    phone: string
}
const EditUser: React.FC<Props> = ({ id, onClose, fetchData }) => {
    const [errors, setErrors] = useState<ValidationErrors>({});
        const { showAlert } = useSweetAlert();
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState<Data>({
    email: "",
    role: "",
    name: "",
    gender: "",
    date_of_birth: "",
    phone: "",
    
    });
    const validateField = (name: string, value: any): string => {
        switch (name) {
            case 'email':
                if (!value.trim()) return 'email harus diisi';
                return '';
            case 'name':
                if (!value.trim()) return 'nama harus diisi';
                return '';
            case 'role':
                if (!value.trim()) return 'role harus diisi';
                return '';
            default:
                return '';
        }
    };
    useEffect(() => {
        getUser()
    }, [])
    const getUser = async () => {
        const user = await GetUserById(id)
        console.log(user)
        setFormData({
            email: user.Email,
            role: user.Role,
            name: user.Name,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            phone: user.Phone,
        })
    }
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
        try{
            await UpdateUser( id, formData.name,formData.email, formData.role, formData.gender, formData.phone, formData.date_of_birth);
            Toast.fire({
                icon: 'success',
                title: 'Data pasien berhasil diubah',
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
    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
       showAlert(
        'warning',
        'Hapus Akun', 
        'Apakah anda yakin?',
        {
            showCancel: true,
            onConfirm: async () => {
                try{
                    await DeleteUser( id);
                    Toast.fire({
                        icon: 'success',
                        title: 'Akun berhasil dihapus',
                    })
                    onClose();
                    fetchData();
                }catch(error:any){
                    Toast.fire({
                        icon: 'error',
                        title: error,
                    })
                }
            },
           
       })
    }
    return (
        <ModalLayout size="lg" open={true} onClose={onClose} title="Tambah Pengguna Baru" subtitle="Masukkan Data Pengguna" 
        footer={
            <div className="flex justify-end pt-4 gap-2">
                 <Button type="button" className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>Hapus Akun</Button>
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
                <Input id="email" disabled name="email" value={formData.email} onChange={handleChange} placeholder="Masukkan email pengguna" required />
                {errors.email && (
                        <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
                )}
            </div>
            <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, role: v })}>
                    <SelectTrigger id="role">
                        <SelectValue placeholder={formData.role || "Pilih role"} />
                        
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
            </div>
            </div>
            <div className="md:grid md:grid-cols-2 gap-4">
                
                <div>
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Masukkan nomor telepon" required />
                    
                </div>
                <div>
                    <Label htmlFor="gender">Jenis Kelamin</Label>
                    <Select onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder={formData.gender || "Pilih jenis kelamin"} />
                        </SelectTrigger>
                        <SelectContent>
                            {['laki-laki', 'perempuan'].map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                   
                </div>      
            </div>
            </form>
        </ModalLayout>
    );
};

export default EditUser;