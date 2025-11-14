import type { Movie } from "../types/movie";
import { axiosInstance } from "./api";

export async function fetchMovies(query: string): Promise<Movie[]> {
  const response = await axiosInstance.get<{ results: Movie[] }>("/search/movie", {
    params: { query, include_adult: false },
  });

  return response.data.results;
}
