import { Navigate, Outlet } from "react-router";
import useAuthStore from "../stores/useAuthStore";
import { jwtDecode } from "jwt-decode";

const GuestRoute = ({ redirectPath }: { redirectPath: string }) => {
    const { token } = useAuthStore();
    
    if (token) {
        const decodedToken: any = token ? jwtDecode(token) : null;
        if (decodedToken.role === "superadmin" ) {
            return <Navigate to="/superadmin/dashboard" replace />;
        }
        if (decodedToken.role === "none" ) {
            return <Navigate to="/none" replace />;
        }
            return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default GuestRoute;