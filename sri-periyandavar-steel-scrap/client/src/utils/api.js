import axios from "axios";

const API = axios.create({
  baseURL: "https://scrap-backend-l7w1.onrender.com" // ✅ LIVE BACKEND
});

// Attach token in every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;