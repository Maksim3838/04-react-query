import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";

import SearchBar from "./components/SearchBar/SearchBar";
import MovieGrid from "./components/MovieGrid/MovieGrid";
import MovieModal from "./components/MovieModal/MovieModal";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import Loader from "./components/Loader/Loader";

import { fetchMovies } from "./services/api";
import type { Movie } from "./types/movie";
import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: false,
    placeholderData: (prev) => prev, // ВАЖЛИВО!
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  async function handleSearch(newQuery: string) {
    if (!newQuery.trim()) {
      toast.error("Enter a movie name!");
      return;
    }

    setQuery(newQuery);
    setPage(1);
    await refetch();
  }

  function handlePageChange({ selected }: { selected: number }) {
    setPage(selected + 1);
    refetch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <h1>Movie Search</h1>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-right" />

      {(isLoading || isFetching) && <Loader />}

      {isError && (
        <ErrorMessage
          message={(error as Error)?.message || "Failed to load movies"}
        />
      )}

      {movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
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
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
