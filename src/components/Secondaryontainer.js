import MovieList from "./movieList";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const SecondaryContainer = () => {
  const movies = useSelector(store => store.movies);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Enhanced loading state
  if (!movies.nowPlayingMovies) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-32 h-32 bg-red-500/5 rounded-full blur-xl`}
              style={{
                top: `${25 + i * 25}%`,
                left: `${25 + i * 25}%`,
              }}
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 1
              }}
            />
          ))}
        </div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-white text-center relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h3 className="text-xl font-bold mb-2 text-glow">Curating Movie Collections</h3>
          <p className="text-gray-400">Discovering the best content for you...</p>
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden"
    >
      {/* Background pattern */}
      <motion.div 
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 pattern-animate opacity-5"
      />
      
      <div className="mt-0 md:-mt-20 lg:-mt-52 relative z-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-8">
        {/* Section header */}
        <motion.div 
          variants={itemVariants}
          className="text-center py-8"
        >
          <motion.h2 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-3xl font-bold text-white text-glow mb-2"
          >
            Discover Amazing Content
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-400 text-lg"
          >
            Handpicked collections just for you
          </motion.p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          className="space-y-8"
        >
          {movies.nowPlayingMovies && (
            <motion.div variants={itemVariants}>
              <MovieList title={"🔥 Now Playing"} movies={movies.nowPlayingMovies} />
            </motion.div>
          )}
          {movies.topRatedMovies && (
            <motion.div variants={itemVariants}>
              <MovieList title={"⭐ Top Rated"} movies={movies.topRatedMovies} />
            </motion.div>
          )}
          {movies.popularMovies && (
            <motion.div variants={itemVariants}>
              <MovieList title={"🎭 Popular"} movies={movies.popularMovies} />
            </motion.div>
          )}
          {movies.upcomingMovies && (
            <motion.div variants={itemVariants}>
              <MovieList title={"🚀 Upcoming Movies"} movies={movies.upcomingMovies} />
            </motion.div>
          )}
          {movies.nowPlayingMovies && (
            <motion.div variants={itemVariants}>
              <MovieList title={"🎬 Netflix Originals"} movies={movies.nowPlayingMovies.slice(0, 10)} />
            </motion.div>
          )}
          {movies.popularMovies && (
            <motion.div variants={itemVariants}>
              <MovieList title={"👻 Thriller & Horror"} movies={movies.popularMovies.slice(5, 15)} />
            </motion.div>
          )}
        </motion.div>
        
        {/* Footer section */}
        <motion.div 
          variants={itemVariants}
          className="text-center py-12"
        >
          <div className="inline-flex items-center space-x-2 text-gray-500">
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i
                }}
                className="w-2 h-2 bg-red-500 rounded-full"
              />
            ))}
            <span>More content loading...</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SecondaryContainer;