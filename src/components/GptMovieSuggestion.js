import { useSelector } from "react-redux";
import MoviesList from "./movieList";
import { motion } from "framer-motion";

const GptMovieSuggestion = () => {
  const { movieResults, movieNames } = useSelector((store) => store.gpt);

  if (!movieNames) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 m-2 sm:m-4 glass-dark rounded-2xl border border-white/10 shadow-2xl"
    >
      <motion.div 
        variants={itemVariants}
        className="mb-4"
      >
        <motion.h2 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-glow text-center"
        >
          🎬 AI Recommendations
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-300 text-center text-sm sm:text-base mt-2"
        >
          Curated just for you by artificial intelligence
        </motion.p>
      </motion.div>
      <motion.div variants={containerVariants}>
        {movieNames.map((movieName, index) => (
          <motion.div
            key={movieName}
            variants={itemVariants}
          >
            <MoviesList
              title={movieName.trim()}
              movies={movieResults[index]}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default GptMovieSuggestion;