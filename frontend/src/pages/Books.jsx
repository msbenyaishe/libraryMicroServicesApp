import { useState, useEffect } from "react";
import { BookPlus, Trash2, Search, Filter, Loader2, Info } from "lucide-react";
import booksService from "../services/booksService";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    ISBN: "",
    publisher: ""
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await booksService.getBooks();
      setBooks(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch books. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await booksService.addBook(newBook);
      setNewBook({ title: "", author: "", ISBN: "", publisher: "" });
      setShowAddForm(false);
      fetchBooks();
    } catch (err) {
      alert("Failed to add book. Please try again.");
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await booksService.deleteBook(id);
        fetchBooks();
      } catch (err) {
        alert("Failed to delete book.");
      }
    }
  };

  const filteredBooks = books.filter(book => 
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.ISBN?.includes(searchTerm)
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="font-heading" style={{ fontSize: '1.875rem' }}>Book Collection</h2>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Manage your library's physical resources</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <BookPlus size={18} />
          <span>{showAddForm ? "Cancel" : "Add New Book"}</span>
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem', animation: 'slideDown 0.3s ease-out' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Register New Book</h3>
          <form onSubmit={handleAddBook}>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={newBook.title}
                  onChange={e => setNewBook({...newBook, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Author</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={newBook.author}
                  onChange={e => setNewBook({...newBook, author: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">ISBN</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={newBook.ISBN}
                  onChange={e => setNewBook({...newBook, ISBN: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Publisher</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={newBook.publisher}
                  onChange={e => setNewBook({...newBook, publisher: e.target.value})}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary">Save Book</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAddForm(false)}>Discard</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Filter by title, author, ISBN..." 
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
          {loading ? (
            <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Loader2 className="animate-spin" size={32} color="var(--primary)" />
              <span className="text-muted">Loading your collection...</span>
            </div>
          ) : error ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
              <button className="btn btn-primary" onClick={fetchBooks}>Retry Connection</button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Book Info</th>
                  <th>ISBN</th>
                  <th>Publisher</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length > 0 ? filteredBooks.map((book) => (
                  <tr key={book._id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{book.title}</span>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>by {book.author}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}>{book.ISBN}</td>
                    <td>{book.publisher}</td>
                    <td>
                      <span className="badge badge-success">Available</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn btn-ghost" style={{ padding: '6px' }} title="Details">
                          <Info size={18} />
                        </button>
                        <button 
                          className="btn btn-ghost" 
                          style={{ padding: '6px', color: 'var(--danger)' }} 
                          title="Delete"
                          onClick={() => handleDeleteBook(book._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No books found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>Showing {filteredBooks.length} books</span>
          <span>Last synced: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Books;