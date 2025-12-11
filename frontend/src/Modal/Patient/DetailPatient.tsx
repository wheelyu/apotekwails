import ModalLayout from "@/components/ModalLayout";
import Props from "./props";
import { User, Phone, MapPin, Droplet, AlertCircle, ChevronDownIcon, CalendarIcon, Heart, Briefcase, Shield, Activity, Contact, Clock } from 'lucide-react';
import { GetPatientByCode, UpdatePatient } from "../../../wailsjs/go/backend/PatientService";
import { useEffect, useState } from "react";
import useFormatAge from "@/utils/useFormatAge";
import useFormatTime from "@/utils/useFormatTime";
import useFormatWithTime from "@/utils/useFormatWithTime";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Toast } from "@/alert/toast";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
interface Patient  {
    ID: number;
    code: string;
    nik?: string ;
    name: string;
    gender: string;
    date_of_birth: any;
    phone: string;
    address: string;
    blood_type: string;
    allergies: string;
    status: boolean;
    religion: string;
    occupation: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    insurance_provider: string;
    insurance_number: string;
    CreatedAt: any;
    UpdatedAt: any;
}
const DetailPatient: React.FC<Props> = ({ onClose, id, fetchData, openQueue }) => {
    const [patient, setPatient] = useState<Patient>({
        ID: 0,
        nik: '',
        code: '',
        name: '',
        gender: '',
        date_of_birth: '',
        phone: '',
        address: '',
        blood_type: '',
        allergies: '',
        status: false,
        religion: '',
        occupation: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        insurance_provider: '',
        insurance_number: '',
        CreatedAt: '',
        UpdatedAt: '',
        });
    const [editPatient, setEditPatient] = useState<Patient>(patient);
    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false)
    const location = useLocation();
    const getPatients = async () => {
        try {
        const response = await GetPatientByCode(id);
        if (response) {
            setPatient(response);
            setEditPatient(response);
        } else {
            console.warn("Response tidak valid:", response);
        }
        } catch (error) {
        console.error("Gagal mengambil data pasien:", error);
        }
    }
    const update = async () => {
    const code = editPatient.code;

    // Format tanggal → YYYY-MM-DD
    const formattedDate = editPatient.date_of_birth
        ? editPatient.date_of_birth.split("T")[0]
        : null;

    // Buat payload final yang akan dikirim ke backend
    const payload = {
        ...editPatient,
        date_of_birth: formattedDate
    };

    try {
        const response = await UpdatePatient(code, payload);

        if (response) {
            Toast.fire({
                icon: 'success',
                title: 'Data pasien berhasil diubah',
            });
            setEdit(false);
            getPatients();
            fetchData();
        } else {
            console.warn("Response tidak valid:", response);
        }

    } catch (error: any) {
        Toast.fire({
            icon: 'error',
            title: error,
        });
        
    }
};

    useEffect(() => {
        getPatients();
    }, []);
    return (
        <ModalLayout open={true} onClose={onClose} size="lg" title="Detail Pasien" subtitle={patient.code}
            footer={<div className="flex flex-row gap-3">
            {
                edit ? (
                    <div className="flex flex-row gap-1">
                        <button 
                            onClick={() => setEdit(false)} 
                            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 transition-all duration-300">
                                Batal
                        </button>
                        <button 
                            onClick={() => {update();}} 
                            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition-all duration-300">
                                Simpan
                        </button>
                    </div>
                    
                ):(
                    <button 
                        onClick={() => setEdit(true)} 
                        className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-all duration-300">
                            Edit Data
                    </button>
                )
            }
            {location.pathname === '/patient' && (
                <button onClick={() => openQueue(patient.ID, patient.name, patient.code)} className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition-all duration-300">
                    Buat Antrian
                </button>
                )
            }
            
            </div>}>
                {/* Header with Avatar */}
                <div className="flex flex-row gap-5 mb-5">
                    <div className="ml-5">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1 rounded-3xl shadow-xl">
                            <div className="bg-white p-6 rounded-3xl">
                            <User size={56} className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center ">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
                        {edit ? (
                            <Input
                            type="text"
                            value={editPatient.name}
                            onChange={(e) => setEditPatient({ ...editPatient, name: e.target.value })}
                            className="text-3xl font-bold bg-transparent"
                            />
                        ) : (
                            patient.name
                        )
                        }
                        </h1>
                    <p className="text-gray-500 font-medium mt-1">Kode Pasien: {patient.code}</p>
                    </div>
                    <div className="text-white">
                    {
                        edit ? (
                            <Select onValueChange={(value) => setEditPatient({ ...editPatient, status: value === 'true' })}>
                                <SelectTrigger className={`w-[180px] text-white ${editPatient.status ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                    <SelectValue placeholder="Status Pasien" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Aktif</SelectItem>
                                    <SelectItem value="false">Tidak Aktif</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                                patient.status 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-rose-500 text-white'
                            }`}>
                                <Activity size={16} />
                                {patient.status ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                        )
                    }
                    </div>
                    
                </div>
                <div className="flex flex-wrap justify-between items-center gap-4 w-full text-sm border-b-2 border-gray-200 mb-5 ">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span>Tanggal Daftar: <span className="font-semibold text-gray-800">{useFormatWithTime(patient.CreatedAt)}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span>Terakhir Datang: <span className="font-semibold text-gray-800">{useFormatWithTime(patient.UpdatedAt)}</span></span>
                    </div>
                </div>
                {/* Main Content Grid */}
                <div className="px-8 pb-8">
                    <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-6 rounded-2xl border border-indigo-200/50">
                        <h2 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                        <div className="bg-indigo-500 p-2 rounded-lg">
                            <User size={18} className="text-white" />
                        </div>
                        Informasi Pribadi
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 group">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <User size={16} className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">NIK</p>
                            {edit ? (
                                <Input
                                type="text"
                                value={editPatient.nik}
                                onChange={(e) => setEditPatient({ ...editPatient, nik: e.target.value })}
                                className="text-xs text-gray-500 font-medium"
                                />
                            ) : (
                                <p className="font-semibold text-gray-800">{patient.nik}</p>
                            )
                            }
                            
                            </div>
                        </div>
                        <div className="flex items-start gap-3 group">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <CalendarIcon size={16} className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Tanggal Lahir</p>
                            {edit ? (
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date"
                                        className="w-48 justify-between font-normal"
                                    >
                                        {editPatient.date_of_birth ? new Date(editPatient.date_of_birth).toLocaleDateString() : "Pilih tanggal"}
                                        <ChevronDownIcon />
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={new Date(editPatient.date_of_birth)}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                        if (date) {
                                            setOpen(false);
                                            setEditPatient({ ...editPatient, date_of_birth: date.toISOString() });
                                        }
                                        }}
                                    />
                                    </PopoverContent>
                                </Popover>

                            ) : (
                                <p className="font-semibold text-gray-800">{useFormatTime(patient.date_of_birth)}</p>
                            )
                            }
                            </div>
                        </div>
                        <div className="flex items-start gap-3 group">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <Contact size={16} className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Usia</p>
                            <p className="font-semibold text-gray-800">{useFormatAge( new Date(patient.date_of_birth))}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 group">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <User size={16} className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Jenis Kelamin</p>
                            {edit ? (
                                <Select
                                value={editPatient.gender}
                                onValueChange={(e) => setEditPatient({ ...editPatient, gender: e })}
                                >
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['Laki-laki', 'Perempuan'].map((b) => (
                                    <SelectItem key={b} value={b}>{b}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            ) : (
                                <p className="font-semibold text-gray-800">{patient.gender || '-'}</p>
                            )}
                            </div>
                        </div>
                        <div className="flex items-start gap-3 group">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <Heart size={16} className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Agama</p>
                            {edit ? (
                                <Select
                                value={editPatient.religion}
                                onValueChange={(e) => setEditPatient({ ...editPatient, religion: e })}
                                >
                                <SelectTrigger id="religion">
                                    <SelectValue placeholder="Pilih agama" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu'].map((b) => (
                                    <SelectItem key={b} value={b}>{b}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            ) : (
                                 <p className="font-semibold text-gray-800">{patient.religion || '-'}</p>
                            )}
                            
                           
                            </div>
                        </div>
                        <div className="flex items-start gap-3 group">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <Briefcase size={16} className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Pekerjaan</p>
                            {edit ? (
                                <Input
                                type="text"
                                value={editPatient.occupation}
                                onChange={(e) => setEditPatient({ ...editPatient, occupation: e.target.value })}
                                className="text-xs text-gray-500 font-medium"
                                />
                            ) : (
                                <p className="font-semibold text-gray-800">{patient.occupation || '-'}</p>
                            )
                            }
                            </div>
                        </div>
                        <div className="flex items-start gap-3 group">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <Phone size={16} className="text-purple-600" />
                            </div>
                            <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Nomor Telepon</p>
                            {edit ? (
                                <Input
                                type="text"
                                value={editPatient.phone}
                                onChange={(e) => setEditPatient({ ...editPatient, phone: e.target.value })}
                                className="text-xs text-gray-500 font-medium"
                                />
                            ) : (
                                <p className="font-semibold text-gray-800">{patient.phone || '-'}</p>
                            )
                            }
                            </div>
                        </div>
                        <div className="flex items-start gap-3 group">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <MapPin size={16} className="text-purple-600" />
                            </div>
                            <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Alamat</p>
                            {edit ? (
                                <textarea
                                value={editPatient.address}
                                onChange={(e) => setEditPatient({ ...editPatient, address: e.target.value })}
                                className="text-xs text-gray-500 font-medium w-full rounded-md border border-slate-300 p-2"
                                />
                            ) : (
                                <p className="font-semibold text-gray-800">{patient.address || '-'}</p>
                            )
                            }
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-6 rounded-2xl border border-rose-200/50">
                        <h2 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
                        <div className="bg-rose-500 p-2 rounded-lg">
                            <Droplet size={18} className="text-white" />
                        </div>
                        Informasi Medis
                        </h2>
                        <div className="space-y-4">
                        <div className="flex items-start gap-3 group">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <Droplet size={16} className="text-rose-600" />
                            </div>
                            <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Golongan Darah</p>
                            {edit ? (
                                <Select
                                value={editPatient.blood_type}
                                onValueChange={(e) => setEditPatient({ ...editPatient, blood_type: e })}
                                >
                                <SelectTrigger id="blood_type">
                                    <SelectValue placeholder="Pilih golongan darah" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['A', 'B', 'AB', 'O', 'A+', 'B+', 'AB+', 'O+','-'].map((b) => (
                                    <SelectItem key={b} value={b}>{b}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            ) : (
                                <p className="font-semibold text-gray-800">{patient.blood_type || '-'}</p>
                            )}
                            </div>
                        </div>
                        <div className="bg-red-100 border-2 border-red-300 p-4 rounded-xl">
                            <div className="flex items-start gap-3">
                            <AlertCircle size={20} className="text-red-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs text-red-700 font-bold mb-1">⚠️ ALERGI</p>
                                {edit ? (
                                <Input
                                    type="text"
                                    value={editPatient.allergies}
                                    onChange={(e) => setEditPatient({ ...editPatient, allergies: e.target.value })}
                                    className="text-xs text-gray-500 font-medium"
                                />
                                ) : (
                                <p className="font-bold text-red-700">{patient.allergies || 'Tidak ada alergi'}</p>
                                )
                                } 
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 rounded-2xl border border-amber-200/50">
                        <h2 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                        <div className="bg-amber-500 p-2 rounded-lg">
                            <AlertCircle size={18} className="text-white" />
                        </div>
                        Kontak Darurat
                        </h2>
                        <div className="space-y-4">
                        <div className="flex items-start gap-3 group">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <User size={16} className="text-amber-600" />
                            </div>
                            <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Nama</p>
                            {edit ? (
                                <Input
                                type="text"
                                value={editPatient.emergency_contact_name}
                                onChange={(e) => setEditPatient({ ...editPatient, emergency_contact_name: e.target.value })}
                                className="text-xs text-gray-500 font-medium"
                                />
                            ) : (
                                <p className="font-semibold text-gray-800">{patient.emergency_contact_name || '-'}</p>
                            )
                            }
                            </div>
                        </div>
                        <div className="flex items-start gap-3 group">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <Phone size={16} className="text-amber-600" />
                            </div>
                            <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Nomor Telepon</p>
                            {
                            edit ? (
                                <Input
                                type="text"
                                value={editPatient.emergency_contact_phone}
                                onChange={(e) => setEditPatient({ ...editPatient, emergency_contact_phone: e.target.value })}
                                className="text-xs text-gray-500 font-medium"
                                />
                            ) : (
                                <p className="font-semibold text-gray-800">{patient.emergency_contact_phone || '-'}</p>
                            )
                            }
                            </div>
                        </div>
                        </div>
                    </div>

                    </div>

                    {/* Insurance Section - Full Width */}
                    <div className="mt-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl border border-emerald-200/50">
                    <h2 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                        <div className="bg-emerald-500 p-2 rounded-lg">
                        <Shield size={18} className="text-white" />
                        </div>
                        Informasi Asuransi
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 group">
                        <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <Shield size={16} className="text-emerald-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Penyedia Asuransi</p>
                            {
                            edit ? (
                                <Input
                                type="text"
                                value={editPatient.insurance_provider}
                                onChange={(e) => setEditPatient({ ...editPatient, insurance_provider: e.target.value })}
                                className="text-xs text-gray-500 font-medium"
                                />
                            ) : (
                                <p className="font-semibold text-gray-800">{patient.insurance_provider || '-'}</p>
                            )
                            }
                        </div>
                        </div>
                        <div className="flex items-start gap-3 group">
                        <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            <Shield size={16} className="text-emerald-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">Nomor Asuransi</p>
                            {
                            edit ? (
                                <Input
                                type="text"
                                value={editPatient.insurance_number}
                                onChange={(e) => setEditPatient({ ...editPatient, insurance_number: e.target.value })}
                                className="text-xs text-gray-500 font-medium"
                                />
                            ) : (
                                <p className="font-semibold text-gray-800">{patient.insurance_number || '-'}</p>
                            )
                            }
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Footer */}
                
        </ModalLayout>
    );
};

export default DetailPatient;