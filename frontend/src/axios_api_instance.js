import axios from "axios";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Access-Control-Allow-Origin": "http://localhost:5173",
  Vary: "Origin",
};

const api_instance = axios.create({
  baseURL: "http://localhost:3000",
  headers: headers,
});

export default api_instance;
