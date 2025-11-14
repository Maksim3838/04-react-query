import axios from "axios";
import type { Movie } from "../types/movie";

const token = import.meta.env.VITE_TMDB_TOKEN;

if (!token) {
  throw new Error("VITE_TMDB_TOKEN is not defined in .env file");
}

export const axiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

export async function fetchMovies(
  query: string,
  page: number
): Promise<MoviesResponse> {
  const response = await axiosInstance.get("/search/movie", {
    params: {
      query,
      page,
    },
  });

  return {
    results: response.data.results,
    total_pages: response.data.total_pages,
  };
}
