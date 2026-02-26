import { useLocation } from "react-router-dom";
import { ChevronRight, Search, Bell, User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <header className="navbar">
      <div className="breadcrumb">
        <span>App</span>
        {pathnames.length > 0 && <ChevronRight size={16} />}
        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
          return (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={isLast ? "text-main font-semibold" : ""}>{capitalized}</span>
              {!isLast && <ChevronRight size={16} />}
            </div>
          );
        })}
        {pathnames.length === 0 && <span className="text-main font-semibold">Dashboard</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="form-input" 
            style={{ paddingLeft: '2.5rem', height: '40px', width: '240px' }}
          />
        </div>
        <button className="btn btn-ghost" style={{ padding: '8px' }}>
          <Bell size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold' }}>
            <User size={20} style={{ margin: 'auto' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Admin User</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Librarian</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
