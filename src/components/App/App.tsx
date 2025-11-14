import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/api";
import css from "./App.module.css";

import type { Movie } from "../../types/movie";

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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

    useEffect(() => {
    async function loadMovies() {
      if (!query) return;

      try {
        const data: MoviesResponse = await fetchMovies(query, page);

        setMovies(data.results);
        setTotalPages(data.total_pages);

        if (data.results.length === 0) {
          toast.error(`No movies found for "${query}"`);
        }
      } catch {
        toast.error("Something went wrong");
      }
    }

    loadMovies();
  }, [query, page]);

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />

      <MovieGrid movies={movies} onSelect={handleSelectMovie} />

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
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

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
