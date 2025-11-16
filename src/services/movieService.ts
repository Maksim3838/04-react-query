import type { Movie } from "../types/movie";
import { axiosInstance } from "./api";

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(
  query: string,
  page: number = 1
): Promise<MoviesResponse> {
  const response = await axiosInstance.get<MoviesResponse>("/search/movie", {
    params: {
      query,
      page,
      include_adult: false,
    },
  });

  return response.data;
}
