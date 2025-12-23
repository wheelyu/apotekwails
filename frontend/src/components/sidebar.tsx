import {
  LayoutDashboard,
  Users,
  Activity,
  Calendar,
  FileText,
  Package,
  Settings,
  UserSquare,
  Banknote
} from 'lucide-react';
import useSideBarStore from '@/stores/useSideBarStore';
import { useLocation, Link } from 'react-router';
import { ReactNode } from 'react';
const Sidebar = () => {

    const location = useLocation();
    const isOpen = useSideBarStore((state) => state.isOpen);
    const toggleSidebar = useSideBarStore((state) => state.toggleSidebar);

    const menuItems = [
      { icon: <LayoutDashboard/>, label: 'Dashboard', to: '/dashboard' },
      { icon: <Users/>, label: 'Pasien', to: '/patient' },
      { icon: <Calendar/>, label: 'Antrian', to: '/order' },
      { icon: <FileText/>, label: 'Rekam Medis', to: '/records' },
      { icon: <Package/>, label: 'Farmasi', to: '/pharmacy' },
      { icon: <Banknote/>, label: 'Pembayaran', to: '/payment' },
    ];
    const otherItems = [
      { icon: <UserSquare/>, label: 'Manajemen User', to: '/user' },
       { icon: <Settings/>, label: 'Pengaturan', to: '/settings' },
    ];

    // Modified NavSection component with active state
    const NavSection = ({ title, items }: { sectionId: string, title: string, items: { icon: ReactNode, label: string, to: string }[] }) => {
      return (
        <div className="mb-6 ">
          {isOpen && (
            <h3 className="text-gray-400 text-sm font-medium mb-2 px-4">{title}</h3>
          )}
          <div className="space-y-1 ">
            {items.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`
                    flex items-center gap-3 px-4 py-2 rounded-lg  transition-all
                    duration-200
                    ${isOpen ? 'justify-start translate-x-0 hover:translate-x-2' : 'justify-center'}
                    ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-black hover:bg-blue-100 '
                    }
                  `}
                >
                  <div className={`${isActive ? 'text-white' : 'text-black'}`}>
                    {item.icon}
                  </div>
                  {isOpen && (
                    <span className="transition-all duration-200">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      );
    };
  
    return (
      <div 
        className={`
          fixed inset-y-0 left-0 bg-white text-blue-600
          transition-all duration-300 ease-in-out
          z-40 shadow-lg
          ${isOpen ? 'w-64 md:w-80' : 'w-20'}
          overflow-hidden
        `}
      >
        <div className="relative h-full flex flex-col">
          
          <div className="p-2 ">
            <div className="p-6 ">
            <div className="flex items-center gap-3" style={{ justifyContent: isOpen ? 'flex-start' : 'center' }}>
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg flex-shrink-0 cursor-pointer" onClick={toggleSidebar} >
                <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              {isOpen && (
                <div className="overflow-hidden transition-all duration-300">
                  <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
                    Sehatin
                  </h1>
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    Sistem Klinik
                  </p>
                </div>
              )}
            </div>
          </div>
            <nav className="space-y-4 max-h-[calc(100vh-200px)] custom-scrollbar mt-5">
              <NavSection 
                sectionId="main-menu"
                title="Main Menu" 
                items={menuItems} 
              />
              <NavSection 
                sectionId="other-menu"
                title="Lainnya" 
                items={otherItems} 
              />
            </nav>
          </div>
        </div>
      </div>
    );
  };
  
  export default Sidebar;