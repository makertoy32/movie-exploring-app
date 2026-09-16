import { motion } from "motion/react";

function MovieCard({ movie, onReadMore }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className="group flex h-155 w-72 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10"
    >
      {/* Poster */}
      <motion.div className="relative h-96 w-full shrink-0 overflow-hidden">
        {movie.poster_path ? (
          <motion.img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-800 text-zinc-500">
            No Poster Available
          </div>
        )}

        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute right-3 top-3 rounded-lg bg-black/80 px-3 py-1.5 text-sm font-semibold text-yellow-400"
        >
          ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
        </motion.div>
      </motion.div>

      {/* Movie Information */}
      <div className="flex flex-1 flex-col p-5">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="line-clamp-2 text-xl font-bold text-white"
        >
          {movie.title}
        </motion.h1>

        {/* Release Date */}
        <p className="mt-2 text-sm text-zinc-400">
          📅 {movie.release_date || "Release date unavailable"}
        </p>

        {/* Overview */}
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-zinc-400">
          {movie.overview || "No overview available."}
        </p>

        {/* Read More */}
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onReadMore(movie)}
          className="mt-auto pt-4 text-left font-semibold text-red-500 transition hover:text-red-400"
        >
          Read More →
        </motion.button>
      </div>
    </motion.div>
  );
}

export default MovieCard;