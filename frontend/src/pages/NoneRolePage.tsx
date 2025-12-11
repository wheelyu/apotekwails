import Header from "../components/header"
import { AlertCircle } from "lucide-react"
import { Toast } from "../alert/toast"
import { useNavigate } from "react-router";
import useAuthStore from "../stores/useAuthStore";
import { useSweetAlert } from '../alert/shadcnAlert';
const NoneRolePage = () => {
    const { showAlert } = useSweetAlert();
  const navigate = useNavigate();
  const { clearToken } = useAuthStore();
    const handleLogout = async () => {
        try {
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
        } catch (error) {
          Toast.fire({
            icon: "error",
            title: "Logout failed",
          });
        }
      };
    return (
        <div className="h-screen bg-gray-50">
            <Header title="Access Denied" />
            
            <div className="flex flex-col items-center justify-center h-4/5 px-4">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-100 p-3 rounded-full">
                            <AlertCircle className="h-12 w-12 text-red-500" />
                        </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h1>
                    
                    <p className="text-gray-600 mb-6">
                        Anda tidak memiliki izin untuk mengakses halaman ini. 
                        Silakan hubungi administrator untuk mendapatkan hak akses.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <button 
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-300"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                        
                    </div>
                </div>
                
                <p className="text-gray-500 mt-8 text-sm">
                    Jika Anda merasa ini adalah kesalahan, hubungi <span className="text-blue-500">admin</span>
                </p>
            </div>
        </div>
    )
}

export default NoneRolePage