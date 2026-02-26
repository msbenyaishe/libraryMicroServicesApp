import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-container">
      {/* Mobile Backdrop */}
      <div 
        className={`sidebar-backdrop ${isSidebarOpen ? "show" : ""}`} 
        onClick={closeSidebar}
      />
      
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="main-content">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
