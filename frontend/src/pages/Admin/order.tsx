import DashboardLayout from "@/components/dashboardLayout";
import BreadCrumbs from '@/components/breadCrumbs'
import { useState, useEffect } from 'react';
import { Search, Clock, User, Stethoscope, FileText, Filter, MoreVertical,Eye, Edit, RefreshCw } from 'lucide-react';
import { GetAllVisitsToday } from "../../../wailsjs/go/backend/VisitService";
import { models } from "wailsjs/go/models";
import ModalQueue from "@/Modal/Order/ChangeOrder";
import ModalStatus from "@/Modal/Order/ChangeStatus";
import ModalView from "@/Modal/Patient/DetailPatient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import  formatTime from "@/utils/useFormatTime";
const Order = () => {

    const [filterDate, setFilterDate] = useState<Date | null>(new Date()); // Set a default value of null
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [activeTab, setActiveTab] = useState('Menunggu');
    const [dataVisit, setDataVisit] = useState<models.Visit[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatusOpen, setModalStatusOpen] = useState(false);
    const [modalViewOpen, setModalViewOpen] = useState(false);
    const [id, setId] = useState(0);
    const [code, setCode] = useState('');  
    const [queueNumber, setQueueNumber] = useState(0);    
    const [status, setStatus] = useState(''); 
    const getVisit = async () => {
        try {
            const dateStr = filterDate ? filterDate.toISOString().split("T")[0] : '';
            const response = await GetAllVisitsToday(dateStr);
            console.log(response);
            setDataVisit(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(() => {
        getVisit();
    }, [filterDate]);
    // Data dummy untuk antrian
    const handleRegist = (id: number, code: string, name: string) => {
        console.log(name, code, id)
    }
    const departments = ['Dokter Umum', 'Dokter Spesialis'];

    const tabs = [
        { id: 'all', label: 'Semua', count: dataVisit.filter(q => q.status !== 'Dibatalkan').length, color: 'bg-blue-500' },
        { id: 'Menunggu', label: 'Menunggu', count: dataVisit.filter(q => q.status === 'Menunggu').length, color: 'bg-cyan-500' },
        { id: 'Sedang diperiksa', label: 'Sedang Diperiksa', count: dataVisit.filter(q => q.status === 'Sedang diperiksa').length, color: 'bg-yellow-500' },
        { id: 'Menunggu obat', label: 'Menunggu Obat', count: dataVisit.filter(q => q.status === 'Menunggu obat').length, color: 'bg-lime-500' },
        { id: 'Selesai', label: 'Selesai', count: dataVisit.filter(q => q.status === 'Selesai').length, color: 'bg-green-500' },
        { id: 'Dibatalkan', label: 'Dibatalkan', count: dataVisit.filter(q => q.status === 'Dibatalkan').length, color: 'bg-red-500' },
    ];

    const filteredData = dataVisit.filter(item => {
        const matchSearch = 
            item.patient?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.complaint.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchDepartment = filterDepartment === 'all' || item.department === filterDepartment;

        // 👇 khusus ALL, exclude Dibatalkan
        const matchStatus = 
            activeTab === 'all'
                ? item.status !== 'Dibatalkan'
                : item.status === activeTab;

        return matchSearch && matchDepartment && matchStatus;
    });


    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Menunggu':
                return 'bg-cyan-100 text-cyan-800 border-cyan-200';
            case 'Sedang diperiksa':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Menunggu obat':
                return 'bg-lime-100 text-lime-800 border-lime-200';
            case 'Selesai':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Dibatalkan':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleEdit = (id: number, code: any, queueNumber: number) => {
        setId(id);
        setCode(code);
        setQueueNumber(queueNumber);
        setModalOpen(true);
    }
    const handleChangeStatus = (id: number, status: string, code: any) => {
        setId(id);
        setStatus(status);
        setCode(code);
        setModalStatusOpen(true);
    }
    const handleDetail = (code: any) => {
        setCode(code);
        setModalViewOpen(true);
    }
    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Daftar Antrian {formatTime(filterDate || new Date())}</h1>
                    <BreadCrumbs title="Antrian" subtitle="" />
                </div>
                <div className="min-h-screen ">
            <div className="p-6">

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Total Antrian</p>
                                <h3 className="text-3xl font-bold">{dataVisit.filter(q => q.status !== 'Dibatalkan').length}</h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <User className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-5 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm mb-1">Menunggu</p>
                                <h3 className="text-3xl font-bold">{dataVisit.filter(q => q.status === 'Menunggu').length}</h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm mb-1">Selesai</p>
                                <h3 className="text-3xl font-bold">{dataVisit.filter(q => q.status === 'Selesai').length}</h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <Stethoscope className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    {/* Tabs */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex flex-wrap gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? tab.color + ' text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {tab.label}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                        activeTab === tab.id
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Cari pasien, ID, atau keluhan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Filter className="text-gray-400 w-5 h-5" />
                            <select
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                                <option value="all">Semua</option>
                                {departments.filter(d => d !== 'all').map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                             {/* FILTER TANGGAL */}
                               <DatePicker
                                    selected={filterDate}
                                    onChange={(date) => setFilterDate(date)}
                                    className="border px-3 py-2 rounded-lg"
                                    dateFormat="yyyy-MM-dd"
                                />

                        </div>
                    </div>
                </div>

                {/* Queue List */}
                <div className="space-y-4">
                    {filteredData.sort((a, b) => a.queue_number - b.queue_number).map((queue) => (
                        <div 
                            key={queue.ID} 
                            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                        >
                            <div className="p-5">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Left Section */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-100 text-blue-700 font-bold text-lg px-4 py-2 rounded-lg">
                                                    #{queue.queue_number}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">{queue.patient?.name}</h3>
                                                    <p className="text-sm text-gray-500">ID: {queue.patient?.code}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(queue.status)}`}>
                                                    {queue.status}
                                                </span>
                                            </div>
                                            
                                        </div>

                                        <div className="flex flex-row gap-4">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Stethoscope className="w-4 h-4 text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Dokter</p>
                                                    <p className="text-sm font-medium">{queue.doctor?.fullname} ({queue.doctor?.specialization})</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 text-gray-700">
                                                <Clock className="w-4 h-4 text-green-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Waktu Kunjungan</p>
                                                    <p className="text-sm font-medium">{queue.visit_time} WIB</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 text-gray-700 ">
                                                <FileText className="w-4 h-4 text-orange-500" />
                                                <div >
                                                    <p className="text-xs text-gray-500 mb-0.5">Keluhan</p>
                                                    <p className="text-sm">{queue.complaint}</p>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>

                                    {/* Right Section - Action Buttons */}
                                    {activeTab !=='Selesai' && (
                                        <div className="flex items-start">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreVertical className="w-5 h-5 text-gray-600" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem onClick={() => handleDetail(queue.patient?.code)} className="cursor-pointer">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Detail
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEdit(queue.ID, queue.patient?.code, queue.queue_number)} className="cursor-pointer">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Ubah Antrian
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleChangeStatus(queue.ID, queue.status, queue.patient?.code)} className="cursor-pointer">
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Ubah Status
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        </div>
                                    )}
                                    
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredData.length === 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada data ditemukan</h3>
                            <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
            </div>
            {modalOpen && (
                <ModalQueue  onClose={() => setModalOpen(false)} fetchData={getVisit} id={id} code={code} queueNumber={queueNumber} />
            )}
            {modalStatusOpen && (
                <ModalStatus onClose={() => setModalStatusOpen(false)} fetchData={getVisit} id={id} code={code} status={status} />
            )}
             {modalViewOpen && <ModalView id={code} onClose={() => setModalViewOpen(false)} fetchData={getVisit} openQueue={handleRegist}/>}
        </DashboardLayout>
    )
}

export default Order