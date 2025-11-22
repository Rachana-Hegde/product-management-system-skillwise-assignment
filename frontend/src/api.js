import axios from "axios";
export const createProduct = (data) =>
  api.post("/products", data);
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

export default api;
