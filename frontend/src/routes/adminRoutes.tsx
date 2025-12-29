import { Navigate, Outlet } from "react-router";
import useAuthStore from "../stores/useAuthStore";
import { jwtDecode } from "jwt-decode";
import { Toast } from "../alert/toast";
const AdminRoute: React.FC = () => {
    const { token } = useAuthStore();
    
    const decodedToken: any = token ? jwtDecode(token) : null;
    console.log(decodedToken);
    if (!token) {
        return <Navigate to={"/login"} replace />;
    }

    if ( decodedToken.role !== "admin" ) {
        Toast.fire({
            icon: "error",
            title: "Only superadmin and admin can access",
        })
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;