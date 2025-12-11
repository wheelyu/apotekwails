import DashboardLayout from "@/components/dashboardLayout";
import { GetTotalPatient } from "../../../wailsjs/go/backend/PatientService";
import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  User,
} from 'lucide-react';
export default function Dashboard() {
        const [isVisible, setIsVisible] = useState(false);
        const [totalPatient, setTotalPatient] = useState(0);
        const [totalVisit, setTotalVisit] = useState(0);
        const [totalPatientNew, setTotalPatientNew] = useState(0);
        useEffect(() => {
            setIsVisible(true);
        }, []);
        useEffect(() => {
          getTotal();
        }, []);
        const getTotal = async () => {
            try {
                const response = await GetTotalPatient();
                console.log(response);
                setTotalPatient(response.Total);
                setTotalVisit(response.TotalVisit);
                setTotalPatientNew(response.TotalPatientNew);
            } catch (error) {
                console.error("Gagal mengambil data pasien:", error);
            }
        }
    return (
        <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Stats Cards */}
        {[
          { label: 'Total Pasien', value: totalPatient, change: '+12% dari bulan lalu', icon: Users, bg: 'bg-blue-100', color: 'text-blue-600', changeColor: 'text-green-600' },
          { label: 'Antrian Hari Ini', value: totalVisit, change: '8 sedang berjalan', icon: Calendar, bg: 'bg-green-100', color: 'text-green-600', changeColor: 'text-blue-600' },
          { label: 'Pasien Baru Hari Ini', value: totalPatientNew, change: '23 hari ini', icon: User, bg: 'bg-purple-100', color: 'text-purple-600', changeColor: 'text-purple-600' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease-out ${index * 0.1}s`
              }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                  <p className={`text-xs ${stat.changeColor} mt-2`}>{stat.change}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease-out 0.5s'
        }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          {[
            { name: 'John Doe', action: 'Pasien baru terdaftar', time: '5' },
            { name: 'Jane Smith', action: 'Konsultasi selesai', time: '10' },
            { name: 'Bob Wilson', action: 'Resep obat diterbitkan', time: '15' },
            { name: 'Alice Brown', action: 'Check-up rutin', time: '20' },
            { name: 'Charlie Davis', action: 'Janji temu dijadwalkan', time: '25' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.name} - {activity.time} menit yang lalu</p>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Detail
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
    );
}
