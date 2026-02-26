import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, ArrowLeftRight, Library, X } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/books", icon: <BookOpen size={20} />, label: "Books" },
    { path: "/members", icon: <Users size={20} />, label: "Members" },
    { path: "/borrowing", icon: <ArrowLeftRight size={20} />, label: "Borrowing" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Library size={32} className="text-primary" />
          <span>LibrisCore</span>
        </div>
        <button 
          className="btn btn-ghost mobile-only" 
          onClick={onClose}
          style={{ padding: '4px' }}
        >
          <X size={24} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
