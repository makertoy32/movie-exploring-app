import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SmoothScroll from "./components/SmoothScroll";

import MovieCard from "./components/MovieCard.jsx";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [movieName, setmovieName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZGEwMDAyOGM3MzBiOTVjMDE2ZjIyODU3NDgxOTQ2YyIsIm5iZiI6MTc4OTU2MTUzNi43MDcsInN1YiI6IjZhYWE4YWMwZWE5ZjgyYTk5MGVjYmVkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VNNbWtu_qaOy_IOsm-d6J283PIONOELgnqdEerG2uCw";

  async function testTMDB(movieName) {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        movieName
      )}&include_adult=false&language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("TMDB request failed.");
    }

    const data = await response.json();

    return data;
  }

  async function getmoviedetails() {
    if (!movieName.trim()) {
      setError("Please enter a movie name.");
      setMovies([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let details = await testTMDB(movieName);

      // Fallback search
      if (details.results?.length === 0) {
        const noSpaces = movieName.replace(/\s+/g, "");

        details = await testTMDB(noSpaces);
      }

      if (!details.results?.length) {
        setMovies([]);
        setError(`No movies found for "${movieName}".`);
        return;
      }

      setMovies(details.results);
    } catch (error) {
      console.error(error);
      setError("Unable to fetch movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-red-950 px-4 py-10 text-white">
        <SmoothScroll />
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Abdul
            <span className="text-red-500">Movie</span>
            Explorer
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-zinc-400"
          >
            Discover movies, ratings, and more.
          </motion.p>
        </motion.div>

        {/* SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            placeholder="Search for a movie..."
            value={movieName}
            onChange={(e) => setmovieName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getmoviedetails();
              }
            }}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900/80 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getmoviedetails}
            disabled={loading}
            className="rounded-xl bg-red-600 px-7 py-3.5 font-bold shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </motion.button>
        </motion.div>

        {/* ERROR */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mx-auto mt-8 max-w-xl rounded-xl border border-red-900 bg-red-950/60 p-4 text-center text-red-300"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOADING */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 flex justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="h-12 w-12 rounded-full border-4 border-zinc-700 border-t-red-500"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOVIE RESULTS */}
        <AnimatePresence>
          {!loading && movies.length > 0 && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-12 grid grid-cols-1 justify-items-center gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {movies.map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  poster_path={movie.poster_path}
                  overview={movie.overview}
                  rating={movie.vote_average}
                  release_date={movie.release_date}
                  language={movie.original_language}
                  vote_count={movie.vote_count}
                  popularity={movie.popularity}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* INITIAL STATE */}
        <AnimatePresence>
          {!loading && !error && movies.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-24 text-center"
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
                className="text-6xl"
              >
                🎬
              </motion.div>

              <h2 className="mt-5 text-2xl font-bold">
                Search for a movie
              </h2>

              <p className="mt-2 text-zinc-500">
                Enter a movie name above to discover movies.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center text-xs text-zinc-600"
        >
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </motion.p>

      </div>
    </div>
  );
}

export default App;