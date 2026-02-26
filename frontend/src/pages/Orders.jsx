import { useState, useEffect, useCallback } from "react";
import { PlusCircle, Calendar, Hash, User, Book as BookIcon, Loader2 } from "lucide-react";
import ordersService from "../services/ordersService";
import booksService from "../services/booksService";
import customersService from "../services/customersService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newOrder, setNewOrder] = useState({
    CustomerID: "",
    BookID: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [ordersRes, booksRes, customersRes] = await Promise.all([
        ordersService.getOrders(),
        booksService.getBooks(),
        customersService.getCustomers()
      ]);

      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      setBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
      setCustomers(Array.isArray(customersRes.data.customers) ? customersRes.data.customers : []);
      setError(null);
    } catch (err) {
      console.error("Borrowing fetch error:", err);
      setError("Failed to fetch borrowing data. Some services might be offline.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      if (!newOrder.CustomerID || !newOrder.BookID) {
        alert("Please select both a member and a book.");
        return;
      }
      
      const now = new Date();
      const nextFortnight = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

      const orderData = {
        ...newOrder,
        initialDate: now.toISOString().split('T')[0],
        deliveryDate: nextFortnight.toISOString().split('T')[0]
      };

      await ordersService.addOrder(orderData);
      setNewOrder({ CustomerID: "", BookID: "" });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      alert("Failed to create borrowing order.");
    }
  };

  // Helper to get names from IDs
  const getCustomerName = (id) => {
    const customer = customers.find(c => c._id === id);
    return customer ? customer.name : "Unknown Member";
  };

  const getBookTitle = (id) => {
    const book = books.find(b => b._id === id);
    return book ? book.title : "Unknown Book";
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="font-heading" style={{ fontSize: '1.875rem' }}>Borrowing Operations</h2>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Track and manage book lending history</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <PlusCircle size={18} />
          <span>{showAddForm ? "Cancel" : "New Borrowing"}</span>
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem', animation: 'slideDown 0.3s ease-out' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Create New Borrowing Record</h3>
          <form onSubmit={handleCreateOrder}>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Select Member</label>
                <select 
                  className="form-input" 
                  required 
                  value={newOrder.CustomerID}
                  onChange={e => setNewOrder({...newOrder, CustomerID: e.target.value})}
                >
                  <option value="">-- Choose a member --</option>
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Select Book</label>
                <select 
                  className="form-input" 
                  required 
                  value={newOrder.BookID}
                  onChange={e => setNewOrder({...newOrder, BookID: e.target.value})}
                >
                  <option value="">-- Choose a book --</option>
                  {books.map(b => (
                    <option key={b._id} value={b._id}>{b.title} by {b.author}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary">Process Borrowing</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: '0' }}>
        {loading ? (
          <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Loader2 className="animate-spin" size={32} color="var(--primary)" />
            <span className="text-muted">Synchronizing borrowing logs...</span>
          </div>
        ) : error ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
            <button className="btn btn-primary" onClick={fetchData}>Retry Sync</button>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
            <table>
              <thead>
                <tr>
                  <th>Order Info</th>
                  <th>Member</th>
                  <th>Book</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Hash size={16} className="text-muted" />
                        <span style={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}>{order._id.substring(0, 8)}...</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={16} className="text-muted" />
                        <span>{getCustomerName(order.CustomerID)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookIcon size={16} className="text-muted" />
                        <span style={{ fontWeight: '500' }}>{getBookTitle(order.BookID)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Calendar size={16} />
                        <span>{order.initialDate ? new Date(order.initialDate).toLocaleDateString() : "N/A"}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-warning">Active Loan</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No borrowing history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;