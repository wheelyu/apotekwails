import {
  Settings,
  LogOut,
  CreditCard,
  UserCircle,
} from 'lucide-react';// Header Component
import useAuthStore from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';
import { useSweetAlert } from '../alert/shadcnAlert';
import {Toast} from '../alert/toast';

const profile = () => {
    const { showAlert } = useSweetAlert();
    const {clearToken} = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = async () => {
      showAlert(
        'warning',
        'Logout', 
        'Are you sure you want to logout?',
        {
          showCancel: true,
          onConfirm: () => {
            Toast.fire({
              icon: "success",
              title: "Logout Success",
            })
            clearToken();
            navigate('/login');
          },
        }
      );
        
      }
    const handleInfo = async () => {
      showAlert(
        'info',
        'Sedang dalam pengembangan', 
        'Fitur ini sedang dalam pengembangan',
        
      )
    }
    
    return (
        <div>
            <div
                className="fixed inset-0 z-40"
            />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-slideDown">
                <div className="p-2">
                <button onClick={() => handleInfo()} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-left transition-colors">
                    <UserCircle  className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Profil Saya</span>
                </button>
                <button onClick={() => handleInfo()} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-left transition-colors">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Billing</span>
                </button>
                <button onClick={() => handleInfo()} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-left transition-colors">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Pengaturan</span>
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button onClick={() => {handleLogout()}} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-left text-red-600 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Keluar</span>
                </button>
                </div>
            </div>
        </div>
    )
}

export default profile