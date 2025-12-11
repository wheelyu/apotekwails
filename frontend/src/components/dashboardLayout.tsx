import { ReactNode } from "react";
import  Header  from "./header";
import  Sidebar  from "./sidebar";
import  useSideBarStore  from "../stores/useSideBarStore";
const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { isOpen } = useSideBarStore();
  const sidebarWidth = isOpen ? (typeof window !== 'undefined' && window.innerWidth < 768 ? '0' : '320px') : '80px';

  return (
    <div className="relative bg-gray-50 min-h-screen">
      <Sidebar />
      <div
        style={{
          marginLeft: sidebarWidth,
          transition: 'margin-left 0.3s ease-in-out'
        }}
        className="flex flex-col min-h-screen"
      >
        <Header title="Dashboard" />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;