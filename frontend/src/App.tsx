import { HashRouter as Router, Routes, Route} from "react-router";
import { SplashScreen, Login, NotFoundPage, NoneRolePage } from './pages';
import { GuestRoute, AdminRoute, NoneRoleRoute } from './routes';
import { Dashboard, Patient, Order, User, PaymentPage } from './pages/Admin';
import { SweetAlertProvider } from './alert/shadcnAlert';
import useIdleTimer from "./utils/useIdleTimer";
import useAuthStore from '@/stores/useAuthStore';
function App() {
  const {clearToken} = useAuthStore();
  useIdleTimer(3600000, () => {   // 1 jam = 3600000 ms
      clearToken();
      window.location.href = "/";  // balik ke login page
  });
  return (
    <SweetAlertProvider>
    <Router>
      <Routes>
        <Route element={<GuestRoute redirectPath="/dashboard" />}>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Route>
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patient" element={<Patient />} />
            <Route path="/order" element={<Order />} />
            <Route path="/records" element={<NotFoundPage />} />
            <Route path="/pharmacy" element={<NotFoundPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/settings" element={<NotFoundPage />} />
            <Route path="/user" element={<User />} />
          </Route>
          <Route element={<NoneRoleRoute />}>
            <Route path="/none" element={<NoneRolePage />} />
          </Route>
      </Routes>
    </Router>
    </SweetAlertProvider>

  )
}

export default App
