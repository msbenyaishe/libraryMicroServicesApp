import axios from "axios";

const API_URL = import.meta.env.VITE_BOOKS_API;

const booksService = {
  getBooks: () => axios.get(`${API_URL}/books`),
  getBook: (id) => axios.get(`${API_URL}/books/${id}`),
  addBook: (book) => axios.post(`${API_URL}/book`, book),
  deleteBook: (id) => axios.delete(`${API_URL}/books/${id}`),
};

export default booksService;