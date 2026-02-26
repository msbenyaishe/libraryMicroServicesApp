import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, ArrowLeftRight, Library } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/books", icon: <BookOpen size={20} />, label: "Books" },
    { path: "/members", icon: <Users size={20} />, label: "Members" },
    { path: "/borrowing", icon: <ArrowLeftRight size={20} />, label: "Borrowing" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Library size={32} className="text-primary" />
        <span>LibrisCore</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
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
