import MovieCard from "./movieCard";
import { motion } from "framer-motion";

const MovieList = ({ title, movies }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (!movies || movies.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-2 sm:px-4 md:px-6 py-4"
      >
        <motion.h1 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl py-2 sm:py-4 text-white font-bold text-glow mb-4"
        >
          {title}
        </motion.h1>
        <div className="flex gap-3 sm:gap-4 md:gap-5">
          {[...Array(6)].map((_, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-28 sm:w-32 md:w-36 lg:w-48 flex-shrink-0"
            >
              <div className="aspect-[2/3] bg-gray-800 rounded-xl skeleton-dark"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-2 sm:px-4 md:px-6 py-4"
    >
      {/* Enhanced title with animation */}
      <div className="flex items-center justify-between mb-4">
        <motion.h1 
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl py-2 sm:py-4 text-white font-bold text-glow relative"
        >
          {title}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-500 to-transparent"
          />
        </motion.h1>
        
        {/* View all button */}
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex items-center text-gray-400 hover:text-white transition-colors duration-300 text-sm group"
        >
          <span className="mr-1">View All</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.button>
      </div>
      
      {/* Movie cards container with enhanced scrolling */}
      <div className="flex overflow-x-scroll scrollbar-hide custom-scrollbar pb-4 relative">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
        
        <motion.div 
          variants={containerVariants}
          className="flex gap-3 sm:gap-4 md:gap-5 px-2"
        >
          {movies?.map((movie, index) => (
            <motion.div 
              key={movie.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MovieCard 
                posterPath={movie.poster_path}
                title={movie.title || movie.original_title}
                rating={movie.vote_average?.toFixed(1)}
                year={movie.release_date?.split('-')[0]}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center mt-2"
      >
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
              className="w-2 h-2 bg-red-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
export default MovieList;