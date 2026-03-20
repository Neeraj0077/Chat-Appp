import axios from "axios";

const isDevelopment = "development";

export const axiosInstance = axios.create({
  // baseURL: false === "development" ? "http://localhost:5001/api/auth" : "/api",\
  baseURL: isDevelopment === "development" ? "http://localhost:3000/api" : "/api",
  withCredentials: true,
});