import DashboardLayout from "@/components/dashboardLayout";
import DataTable from 'react-data-table-component'
import BreadCrumbs from '@/components/breadCrumbs'
import customStyles from '@/utils/customStyles'
import TabActionHeader from '@/components/tabActionHeader';
import SummaryCardGrid from '@/components/summaryCardGrid';
import { GetAllPatients, DeletePatient } from '../../../wailsjs/go/backend/PatientService';
import { models } from "wailsjs/go/models";
import { useState, useEffect } from "react";
import ModalAdd from "@/Modal/Patient/AddPatient";
import ModalView from "@/Modal/Patient/DetailPatient";
import ModalRegist from "@/Modal/Patient/RegistPatient";
import ModalInsert from "@/Modal/Patient/ImportPatient";
import { useSweetAlert } from '../../alert/shadcnAlert';
import { Toast } from "@/alert/toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  Users,
  X,
  MoreVertical,
  Eye,
  PlusCircle,
  Trash
} from 'lucide-react';

type PatientFiltered =  {
  ID: number;
  code: string;
  nik?: string;
  name: string;
  gender: string;
  phone: string;
  status: boolean;
  address: string;
};
const Patient = () => {
        const [patientData, setPatientData] = useState<models.Patient[]>([]);
        const [searchData, setSearchData] = useState({
            name: '',
            address: '',
            code: '',
            nik: '',
            phone: '',
        });
        const { showAlert } = useSweetAlert();
        const [modalAddOpen, setModalAddOpen] = useState(false);
        const [modalViewOpen, setModalViewOpen] = useState(false);
        const [modalInsertOpen, setModalInsertOpen] = useState(false);
        const [modalRegistOpen, setModalRegistOpen] = useState(false);
        const [page, setPage] = useState(1);
        const [pageSize, setPageSize] = useState(10);
        const [total, setTotal] = useState(0);
        const [totalPatient, setTotalPatient] = useState(0);
        const [totalRows, setTotalRows] = useState(0);
        const [id, setId] = useState(0);
        const [code, setCode] = useState('');
        const [loading, setLoading] = useState(false);
        const [activePatient, setActivePatient] = useState(0);
        useEffect(() => {
            getPatients();
        }, [page, pageSize, searchData]);

        const getPatients = async () => {
            setLoading(true);
            try {
            const response = await GetAllPatients( {
                name: searchData.name, 
                address: searchData.address, 
                code: searchData.code, 
                nik: searchData.nik,
                phone: searchData.phone, 
                page, 
                pageSize
            });
                setPatientData(response.data);
                setTotal(response.total_pages);
                setTotalPatient(response.total_all_rows);
                setTotalRows(response.total_rows);
                setActivePatient(response.activePatient);
            setLoading(false);
            } catch (error) {
            console.error("Gagal mengambil data pasien:", error);
            }
        };
        const columns = [
        {
            name: 'No. RM',
            selector: (row: PatientFiltered) => row.code,
            sortable: true,
        },
         {
            name: 'Nama',
            selector: (row: PatientFiltered) => row.name,
            sortable: true,
        },  
        {
            name: 'NIK',
            selector: (row: PatientFiltered) => row.nik || '-',
            sortable: true,
        },
       
        {
            name: 'Alamat',
            selector: (row: PatientFiltered) => row.address || '-',
            sortable: true,
        },
         {
            name: 'No Hp',
            selector: (row: PatientFiltered) => row.phone || '-',
            sortable: true,

        },
        {
            name: 'Aksi',
            cell: (row: PatientFiltered) => (
                <div>
                    <div className="flex items-start">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 bg-gray-100 rounded-lg transition-colors">
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={handleView.bind(null, row.code)} className="cursor-pointer ">
                                <Eye className="w-4 h-4 mr-2" />
                                Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleRegist.bind(null, row.ID, row.code, row.name)} className="cursor-pointer ">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Tambah Antrian
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleDelete.bind(null, row.code)}  className="cursor-pointer bg-red-500 text-white hover:bg-red-600">
                                <Trash className="w-4 h-4 mr-2" />
                                Hapus Data
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                </div>
            ),
        }
    ];
        const handleDelete = async (code: string) => {
            await showAlert(
                    'warning',
                    'Delete', 
                    'Anda yakin ingin menghapus data ini?',
                    {
                      showCancel: true,
                      onConfirm: () => {
                        try{
                            DeletePatient(code);
                            Toast.fire({
                                icon: 'success',
                                title: 'Data berhasil dihapus',
                            })
                            getPatients();
                        }catch(error:any){
                            Toast.fire({
                                icon: 'error',
                                title: error,
                            })
                        }
                      },
                    }
                  );
            
        }
    const handleRegist = (id: number, code: string, name: string) => {
        setModalViewOpen(false);
        console.log(name)
        setId(id);
        setCode(code);
        setModalRegistOpen(true);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
        ...prev,
        [name]: value
    }));
};

    const handleView = (id: string) => {
        // Implement your edit logic here
        setCode(id);
        setModalViewOpen(true);
    }
    const refresh = () => {
        getPatients();
    }
    const handleImport = () => {
        setModalInsertOpen(true);
    }
    const exportData = async () => {
        // Implement your export logic here
    }
    const handleSearch = () => {
        getPatients();
    }
    return (
        <DashboardLayout>
        <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Pasien</h1>
                    <BreadCrumbs title="Patient" subtitle="" />
                </div>
                {/* Stats Cards */}
                <SummaryCardGrid
                    columns="lg:grid-cols-3"
                    items={[
                        {
                        label: "Total Pasien",
                        value: totalPatient,
                        icon: Users,
                        bgColor: "bg-indigo-50",
                        iconColor: "text-indigo-500",
                        },
                        {
                        label: "Pasien Aktif",
                        value: activePatient,
                        icon: Users,
                        bgColor: "bg-green-50",
                        iconColor: "text-green-500",
                        },
                        {
                        type: "add",
                        label: "Tambah Pasien",
                        buttonText: "Tambah",
                        onClick: () => setModalAddOpen(true),
                        },
                    ]}
                    />

                <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[600px]'>
                    {/* Tab Navigation */}
                    <TabActionHeader
                        total_rows={(searchData.name || searchData.address || searchData.code || searchData.nik || searchData.phone) ? totalRows : pageSize}
                        total_patient={totalPatient}
                        onImport={handleImport}
                        onExport={exportData}
                        onRefresh={refresh}
                    />
                <div className="relative mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {/* No. RM */}
                        <div className="relative">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                            No. RM
                        </label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            className="border border-gray-300 bg-white rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Cari No. RM Pasien"
                            value={searchData.code}
                            onChange={handleChange}
                        />
                        </div>
                        {/* Nama Pasien */}
                        <div className="relative">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Pasien
                        </label>
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                            type="text"
                            id="name"
                            name="name"
                            className="border border-gray-300 bg-white rounded p-2 w-full pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Cari Nama Pasien"
                            value={searchData.name}
                            onChange={handleChange}
                            />
                        </div>
                        </div>

                       
                        

                        {/* NIK */}
                        <div className="relative">
                        <label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-1">
                            NIK
                        </label>
                        <input
                            type="text"
                            id="nik"
                            name="nik"
                            className="border border-gray-300 bg-white rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Cari NIK Pasien"
                            value={searchData.nik}
                            onChange={handleChange}
                        />
                        </div>
                        {/* Alamat */}
                        <div className="relative">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            className="border border-gray-300 bg-white rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Cari Alamat Pasien"
                            value={searchData.address}
                            onChange={handleChange}
                        />
                        </div>

                        {/* No Hp */}
                        <div className="relative">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            No Hp
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            className="border border-gray-300 bg-white rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Cari No Hp Pasien"
                            value={searchData.phone}
                            onChange={handleChange}
                        />
                        </div>
                    </div>

                    {/* Button Section */}
                    <div className="mt-4 flex justify-end absolute top-2.5 right-1">
                        {(searchData.name || searchData.address || searchData.code || searchData.nik || searchData.phone) ? (
                        <button
                            type="button"
                            className="flex items-center gap-2 text-white bg-red-500 px-5 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md"
                            onClick={() => setSearchData({ name: '', address: '', code: '', nik: '', phone: '' })}
                        >
                            <X size={20} />
                        </button>
                        ) : (
                        <button
                            type="button"
                            className="flex items-center gap-2 text-white bg-blue-500 px-5 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
                            onClick={handleSearch}
                        >
                            <Search size={20} />
                        </button>
                        )}
                    </div>
                    </div>

                
                <DataTable
                columns={columns}
                data={patientData}
                pagination
                paginationServer        // wajib untuk server-side pagination
                paginationTotalRows={total} // total hasil query dari backend
                onChangePage={(page) => {
                    setPage(page);         // ini update page state kamu
                }}
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10,50, 100, 200, 500]}
                onChangeRowsPerPage={(newLimit, page) => {
                    setPageSize(newLimit);    // update limit
                    setPage(page);         // optional reset or stay
                }}
                progressPending={loading}
                customStyles={customStyles}
                striped
                responsive
                highlightOnHover
                noDataComponent={
                    <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                    <Plus className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-lg font-medium">No Patient found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                }
                />

               
            </div>
            </div>
            {modalAddOpen && <ModalAdd onClose={() => setModalAddOpen(false)} fetchData={getPatients} />}
            {modalViewOpen && <ModalView id={code} onClose={() => setModalViewOpen(false)} fetchData={getPatients} openQueue={handleRegist}/>}
            {modalRegistOpen && <ModalRegist id={id} code={code} onClose={() => setModalRegistOpen(false)} fetchData={getPatients} />}
            {modalInsertOpen && <ModalInsert onClose={() => setModalInsertOpen(false)} fetchData={getPatients} />}
        </DashboardLayout>
    );
};

export default Patient;