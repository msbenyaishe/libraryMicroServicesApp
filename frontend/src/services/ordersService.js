import axios from "axios";

const API_URL = import.meta.env.VITE_ORDERS_API;

const ordersService = {
  getOrders: () => axios.get(`${API_URL}/orders`),
  getOrder: (id) => axios.get(`${API_URL}/order/${id}`),
  addOrder: (order) => axios.post(`${API_URL}/order`, order),
};

export default ordersService;