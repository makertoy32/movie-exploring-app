import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import MovieCard from "./components/MovieCard.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [movieName, setMovieName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZGEwMDAyOGM3MzBiOTVjMDE2ZjIyODU3NDgxOTQ2YyIsIm5iZiI6MTc4OTU2MTUzNi43MDcsInN1YiI6IjZhYWE4YWMwZWE5ZjgyYTk5MGVjYmVkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VNNbWtu_qaOy_IOsm-d6J283PIONOELgnqdEerG2uCw";

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (selectedMovie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMovie]);

  async function searchTMDB(query) {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query,
      )}&include_adult=false&language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `TMDB could not complete the request (${response.status}).`,
      );
    }

    return await response.json();
  }

  async function getMovieDetails() {
    if (!movieName.trim()) {
      setError("Please enter a movie name.");
      setMovies([]);
      return;
    }

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      // First search
      let details = await searchTMDB(movieName.trim());

      // If nothing found, try without spaces
      if (!details.results?.length) {
        const noSpaces = movieName.trim().replace(/\s+/g, "");

        if (noSpaces !== movieName.trim()) {
          details = await searchTMDB(noSpaces);
        }
      }

      if (!details.results?.length) {
        setError(`No movies found for "${movieName}".`);
        return;
      }

      setMovies(details.results);
    } catch (error) {
      console.error(error);
      setError(
        error.message || "Something went wrong while fetching movies.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSearchKeyDown(e) {
    if (e.key === "Enter") {
      getMovieDetails();
    }
  }

  function closeModal() {
    setSelectedMovie(null);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-red-950 text-white">
      {/* Smooth Scrolling */}
      <SmoothScroll disabled={Boolean(selectedMovie)} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 py-10 text-center"
      >
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          🎬 <span className="text-red-500">Movie Explorer</span>
        </h1>

        <p className="mt-3 text-zinc-400">
          Search for movies and explore their details
        </p>
      </motion.header>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mx-auto flex max-w-2xl flex-col gap-3 px-6 sm:flex-row"
      >
        <input
          type="text"
          placeholder="Search for a movie..."
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
        />

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={getMovieDetails}
          disabled={loading}
          className="rounded-xl bg-red-600 px-7 py-3 font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Searching..." : "Find"}
        </motion.button>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-8 max-w-xl px-6"
          >
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400">
              ⚠️ {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-16"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="h-10 w-10 rounded-full border-4 border-zinc-700 border-t-red-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Movies */}
      {!loading && movies.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto mt-12 flex max-w-7xl flex-wrap justify-center gap-6 px-6 pb-16"
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <MovieCard
                movie={movie}
                onReadMore={setSelectedMovie}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Initial State */}
      {!loading && !error && movies.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center px-6 py-24 text-center"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-7xl"
          >
            🎬
          </motion.div>

          <h2 className="mt-6 text-2xl font-bold">
            Find Your Next Movie
          </h2>

          <p className="mt-2 text-zinc-500">
            Search for a movie above to explore its details.
          </p>
        </motion.div>
      )}

      {/* Movie Details Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closeModal}
          >
            {/* Modal */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-xl text-white transition hover:bg-red-600"
              >
                ✕
              </motion.button>

              {/* Poster */}
              <div className="relative h-64 overflow-hidden sm:h-80">
                {selectedMovie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w780${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full bg-zinc-800" />
                )}

                <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="absolute bottom-5 left-5 right-5"
                >
                  <h2 className="pr-10 text-3xl font-bold sm:text-4xl">
                    {selectedMovie.title}
                  </h2>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center">
                    <p className="text-xs text-zinc-500">Rating</p>
                    <p className="mt-1 text-lg font-bold text-yellow-400">
                      ⭐{" "}
                      {selectedMovie.vote_average
                        ? selectedMovie.vote_average.toFixed(1)
                        : "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center">
                    <p className="text-xs text-zinc-500">Release</p>
                    <p className="mt-1 text-sm font-semibold">
                      {selectedMovie.release_date || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center">
                    <p className="text-xs text-zinc-500">Language</p>
                    <p className="mt-1 text-sm font-semibold uppercase">
                      {selectedMovie.original_language || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center">
                    <p className="text-xs text-zinc-500">Votes</p>
                    <p className="mt-1 text-sm font-semibold">
                      {selectedMovie.vote_count || 0}
                    </p>
                  </div>
                </div>

                {/* Overview */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold">Overview</h3>

                  <p className="mt-2 leading-7 text-zinc-400">
                    {selectedMovie.overview || "No overview available."}
                  </p>
                </div>

                {/* Popularity */}
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-zinc-400">
                      Popularity
                    </span>

                    <span className="text-sm font-semibold text-red-400">
                      {selectedMovie.popularity
                        ? selectedMovie.popularity.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          selectedMovie.popularity || 0,
                          100,
                        )}%`,
                      }}
                      transition={{
                        delay: 0.2,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full bg-red-600"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-sm text-zinc-500">
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </div>
  );
}

export default App;