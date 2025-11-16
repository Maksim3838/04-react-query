import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";

import { fetchMovies } from "../../services/api";
import css from "./App.module.css";

import type { Movie } from "../../types/movie";

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  function handleSearch(newQuery: string) {
    setQuery(newQuery);
    setPage(1);
  }

  function handleSelectMovie(movie: Movie) {
    setSelectedMovie(movie);
  }

  function handleCloseModal() {
    setSelectedMovie(null);
  }

    const {
    data,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<MoviesResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.length > 0, 
    placeholderData: (prev) => prev, 
    retry: 1,
  });

    if (isSuccess && data.results.length === 0) {
    toast.error(`No movies found for "${query}"`);
  }

  return (
    <div>
            <Toaster />

      <SearchBar onSubmit={handleSearch} />

            {isLoading && <Loader />}
      {isError && <ErrorMessage message="Something went wrong" />}

      {isSuccess && (
        <>
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />

          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
