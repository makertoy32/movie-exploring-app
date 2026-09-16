import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

function MovieCard(props) {
  const [showOverview, setShowOverview] = useState(false);

  return (
    <>
      {/* MOVIE CARD */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{
          y: -10,
          scale: 1.02,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="group flex h-155 w-72 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10"
      >
        {/* Poster */}
        <motion.div
          className="relative h-96 w-full shrink-0 overflow-hidden"
        >
          {props.poster_path ? (
            <motion.img
              src={`https://image.tmdb.org/t/p/w500${props.poster_path}`}
              alt={props.title}
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
            ⭐ {props.rating ? props.rating.toFixed(1) : "N/A"}
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
            {props.title}
          </motion.h1>

          {/* Release Date */}
          <p className="mt-2 text-sm text-zinc-400">
            📅 {props.release_date || "Release date unavailable"}
          </p>

          {/* Overview */}
          <p className="mt-3 line-clamp-4 text-sm leading-6 text-zinc-400">
            {props.overview || "No overview available."}
          </p>

          {/* Read More */}
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowOverview(true)}
            className="mt-auto pt-4 text-left font-semibold text-red-500 transition hover:text-red-400"
          >
            Read More →
          </motion.button>
        </div>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {showOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 "
            onClick={() => setShowOverview(false)}
          >
            {/* Modal */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.85,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{
                  scale: 1.1,
                  rotate: 90,
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOverview(false)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-xl text-white"
              >
                ✕
              </motion.button>

              {/* Modal Poster */}
              <div className="relative h-64 overflow-hidden sm:h-80">
                {props.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w780${props.poster_path}`}
                    alt={props.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full bg-zinc-800" />
                )}

                <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-5 left-5 right-5"
                >
                  <h2 className="pr-10 text-3xl font-bold sm:text-4xl">
                    {props.title}
                  </h2>
                </motion.div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center"
                  >
                    <p className="text-xs text-zinc-500">Rating</p>
                    <p className="mt-1 text-lg font-bold text-yellow-400">
                      ⭐ {props.rating ? props.rating.toFixed(1) : "N/A"}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center"
                  >
                    <p className="text-xs text-zinc-500">Release</p>
                    <p className="mt-1 text-sm font-semibold">
                      {props.release_date || "N/A"}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center"
                  >
                    <p className="text-xs text-zinc-500">Language</p>
                    <p className="mt-1 text-sm font-semibold uppercase">
                      {props.language || "N/A"}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-center"
                  >
                    <p className="text-xs text-zinc-500">Votes</p>
                    <p className="mt-1 text-sm font-semibold">
                      {props.vote_count || 0}
                    </p>
                  </motion.div>
                </div>

                {/* Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6"
                >
                  <h3 className="text-lg font-bold">
                    Overview
                  </h3>

                  <p className="mt-2 leading-7 text-zinc-400">
                    {props.overview || "No overview available."}
                  </p>
                </motion.div>

                {/* Popularity */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="mt-6"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-zinc-400">
                      Popularity
                    </span>

                    <span className="text-sm font-semibold text-red-400">
                      {props.popularity
                        ? props.popularity.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          props.popularity || 0,
                          100
                        )}%`,
                      }}
                      transition={{
                        delay: 0.5,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full bg-red-600"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MovieCard;