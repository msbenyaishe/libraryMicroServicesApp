import axios from "axios";

const API_URL = import.meta.env.VITE_CUSTOMERS_API;

const customersService = {
  getCustomers: () => axios.get(`${API_URL}/customers`),
  getCustomer: (id) => axios.get(`${API_URL}/customers/${id}`),
  addCustomer: (customer) => axios.post(`${API_URL}/customer`, customer),
  deleteCustomer: (id) => axios.delete(`${API_URL}/customers/${id}`),
};

export default customersService;