import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, ArrowLeftRight, TrendingUp } from "lucide-react";
import booksService from "../services/booksService";
import customersService from "../services/customersService";
import ordersService from "../services/ordersService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    books: 0,
    members: 0,
    orders: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, customersRes, ordersRes] = await Promise.all([
          booksService.getBooks(),
          customersService.getCustomers(),
          ordersService.getOrders()
        ]);

        setStats({
          books: Array.isArray(booksRes.data) ? booksRes.data.length : 0,
          members: Array.isArray(customersRes.data.customers) ? customersRes.data.customers.length : 0,
          orders: Array.isArray(ordersRes.data) ? ordersRes.data.length : 0,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setStats(prev => ({ ...prev, loading: false, error: "Failed to load dashboard statistics." }));
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Books", value: stats.books, icon: <BookOpen size={24} />, color: "var(--primary)" },
    { label: "Active Members", value: stats.members, icon: <Users size={24} />, color: "var(--secondary)" },
    { label: "Borrowing Orders", value: stats.orders, icon: <ArrowLeftRight size={24} />, color: "var(--accent)" },
  ];

  if (stats.loading) {
    return <div className="text-muted">Loading stats...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="font-heading" style={{ fontSize: '1.875rem' }}>Dashboard Overview</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--secondary)', fontWeight: '600', fontSize: '0.875rem' }}>
          <TrendingUp size={16} />
          <span>System Healthy</span>
        </div>
      </div>

      {stats.error && (
        <div className="badge badge-danger" style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', display: 'block' }}>
          {stats.error}
        </div>
      )}

      <div className="grid grid-cols-3">
        {statCards.map((card, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{card.label}</h3>
              <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem', color: 'var(--text-main)' }}>{card.value}</p>
            </div>
            <div style={{ padding: '0.625rem', borderRadius: '12px', background: `${card.color}15`, color: card.color }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h4 style={{ marginBottom: '1rem' }}>Quick Actions</h4>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/borrowing')}>Create Borrowing</button>
            <button className="btn btn-secondary" onClick={() => navigate('/books')}>Add New Book</button>
          </div>
        </div>
        <div className="card">
          <h4 style={{ marginBottom: '1rem' }}>System Status</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span>Books Service</span>
              <span className="badge badge-success">Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span>Customers Service</span>
              <span className="badge badge-success">Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span>Orders Service</span>
              <span className="badge badge-success">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
