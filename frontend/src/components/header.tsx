import {
  Menu,
  X,
  Bell,
  ChevronDown,
  User,
} from 'lucide-react';// Header Component
import useSideBarStore from '@/stores/useSideBarStore';
import Profile from './profile';
import { useState } from 'react';

const Header = ({ title }: { title: string }) => {
    const isOpen = useSideBarStore((state) => state.isOpen);
    const toggleSidebar = useSideBarStore((state) => state.toggleSidebar);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const notifications = [
        { id: 1, text: 'Pasien baru terdaftar', time: '5 menit lalu' },
        { id: 2, text: 'Janji temu dalam 30 menit', time: '15 menit lalu' },
        { id: 3, text: 'Stok obat menipis', time: '1 jam lalu' },
    ];

    return (
    <header
      style={{
        transition: 'margin-left 0.3s ease-in-out'
      }}
      className="sticky top-0 z-30 bg-white border-b border-gray-200 "
    >
      <div className="flex items-center justify-between px-6 py-5">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <>
                <div
                  onClick={() => setShowNotifications(false)}
                  className="fixed inset-0 z-40"
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-slideDown">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <p className="text-sm text-gray-900">{notif.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showProfile && (
              <div onClick={() => setShowProfile(false)}>
                <Profile />
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;
