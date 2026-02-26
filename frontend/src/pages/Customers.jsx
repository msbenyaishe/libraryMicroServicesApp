import { useState, useEffect } from "react";
import { UserPlus, Trash2, Search, Mail, Phone, Loader2, Info } from "lucide-react";
import customersService from "../services/customersService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customersService.getCustomers();
      setCustomers(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch members. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await customersService.addCustomer(newCustomer);
      setNewCustomer({ name: "", email: "", phone: "" });
      setShowAddForm(false);
      fetchCustomers();
    } catch (err) {
      alert("Failed to add member. Please try again.");
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await customersService.deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        alert("Failed to delete member.");
      }
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="font-heading" style={{ fontSize: '1.875rem' }}>Library Members</h2>
          <p className="text-muted">Manage registered library patrons</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus size={18} />
          <span>{showAddForm ? "Cancel" : "Add New Member"}</span>
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem', animation: 'slideDown 0.3s ease-out' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Register New Member</h3>
          <form onSubmit={handleAddCustomer}>
            <div className="grid grid-cols-3">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  required 
                  value={newCustomer.email}
                  onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={newCustomer.phone}
                  onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Register Member</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAddForm(false)}>Discard</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search members by name or email..." 
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
          {loading ? (
            <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Loader2 className="animate-spin" size={32} color="var(--primary)" />
              <span className="text-muted">Fetching member directory...</span>
            </div>
          ) : error ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
              <button className="btn btn-primary" onClick={fetchCustomers}>Retry Connection</button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Contact Details</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
                          {customer.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '600' }}>{customer.name}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          <Mail size={14} />
                          <span>{customer.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          <Phone size={14} />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-success">Active</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-ghost" style={{ padding: '6px' }} title="View Profile">
                          <Info size={18} />
                        </button>
                        <button 
                          className="btn btn-ghost" 
                          style={{ padding: '6px', color: 'var(--danger)' }} 
                          title="Delete Member"
                          onClick={() => handleDeleteCustomer(customer._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No members found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;