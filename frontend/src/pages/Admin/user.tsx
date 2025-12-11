import DashboardLayout from "@/components/dashboardLayout";
import DataTable from 'react-data-table-component'
import BreadCrumbs from '@/components/breadCrumbs'
import customStyles from '@/utils/customStyles'
import { GetUsers } from '../../../wailsjs/go/backend/UserService';
import { models } from "wailsjs/go/models";
import { useState, useEffect } from "react";
import ModalAdd from "@/Modal/User/AddUser";
import ModalEdit from "@/Modal/User/EditUser";
import {
  Plus,
  Pencil
} from 'lucide-react';

type UserFiltered =  {
  email: string;
  name: string;
  gender: string;
  date_of_birth: any;
  phone: string;
  role: string;
  id: number
};
const User = () => {
        const [userData, setUserData] = useState<models.User[]>([]);
        const [modalAddOpen, setModalAddOpen] = useState(false);
        const [modalEditOpen, setModalEditOpen] = useState(false);
        const [id, setId] = useState(0);
        const [page, setPage] = useState(1);
        const [pageSize, setPageSize] = useState(10);
        const [loading, setLoading] = useState(false);
        const handleEdit = (id: number) => {
            setId(id);
            setModalEditOpen(true);
        }
        const filteredData = userData.map(user => ({
            email: user.Email,
            name: user.Name,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            phone: user.Phone,
            role: user.Role,
            id: user.ID
        }));

        useEffect(() => {
            getPatients();
        }, [page, pageSize]);

        const getPatients = async () => {
            setLoading(true);
            try {
            const response = await GetUsers();
            console.log(response);
                setUserData(response);
            setLoading(false);
            } catch (error) {
            console.error("Gagal mengambil data pasien:", error);
            }
        };
        const columns = [
        {
            name: 'Email',
            selector: (row: UserFiltered) => row.email,
            sortable: true,
        },
        {
            name: 'Nama',
            selector: (row: UserFiltered) => row.name,
            sortable: true,
        },
        {
            name: 'Role',
            selector: (row: UserFiltered) => row.role,
            sortable: true,
        },
        {
            name: 'Aksi',
            cell: (row: UserFiltered) => (
                <div className="flex items-center space-x-2">
                    <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {handleEdit(row.id)}}
                    >
                        <Pencil size={16} />
                    </button>
                </div>
            ),
        }

       
    ];
    return (
        <DashboardLayout>
        <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
                    <BreadCrumbs title="Pengguna" subtitle="" />
                </div>
                {/* Stats Cards */}
                <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[600px]'>
                    <div className="flex justify-between w-full border-b-2 border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Daftar Pengguna
                    </h1>
                    <button onClick={() => setModalAddOpen(true)} className="inline-flex mb-2 justify-end items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white tranisition-all duration-300 bg-blue-500 hover:bg-blue-600">
                        Tambah Pengguna
                    </button>
                    </div>
                <DataTable
                columns={columns}
                data={filteredData}
                pagination
                paginationServer        // wajib untuk server-side pagination
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
            {modalEditOpen && <ModalEdit id={id} onClose={() => setModalEditOpen(false)} fetchData={getPatients} />}
        </DashboardLayout>
    );
};

export default User;