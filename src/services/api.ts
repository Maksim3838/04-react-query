import axios from "axios";

const token = import.meta.env.VITE_TMDB_TOKEN;

if (!token) {
  throw new Error("VITE_TMDB_TOKEN is not defined in .env");
}

export const axiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
