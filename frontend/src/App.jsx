import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/members" element={<Customers />} />
        <Route path="/borrowing" element={<Orders />} />
      </Routes>
    </Layout>
  );
}

export default App;