import { useSelector } from "react-redux";
import VideoBackground from "./VideoBackground";
import VideoTitle from "./VideoTitle";
import { motion } from "framer-motion";

const MainContainer = () => {
  const movies = useSelector(store => store.movies?.nowPlayingMovies);
  
  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const particleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Enhanced loading state with cinematic feel
  if (!movies || movies.length === 0) {
    return (
      <motion.div 
        variants={loadingVariants}
        initial="hidden"
        animate="visible"
        className="pt-[30%] sm:pt-[25%] md:pt-0 bg-black relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              variants={particleVariants}
              className={`absolute w-32 h-32 bg-red-500/10 rounded-full blur-xl`}
              style={{
                top: `${25 + i * 15}%`,
                left: `${25 + i * 20}%`,
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, 10, -5, 0],
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 1
              }}
            />
          ))}
        </div>
        
        {/* Loading content */}
        <motion.div 
          variants={loadingVariants}
          className="text-white text-center relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl md:text-3xl font-bold mb-4 text-glow-red"
          >
            Loading Cinematic Experience
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-gray-300 text-lg mb-6"
          >
            Preparing your personalized movie journey...
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="loading-dots"
          >
            <span></span>
            <span></span>
            <span></span>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  const mainMovies = movies[0];
  const { original_title, overview, id } = mainMovies;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="pt-[30%] sm:pt-[25%] md:pt-0 bg-black relative overflow-hidden"
    >
      {/* Enhanced video title with animations */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <VideoTitle title={original_title} overview={overview} />
      </motion.div>
      
      {/* Enhanced video background */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.1 }}
      >
        <VideoBackground movieId={id} />
      </motion.div>
      
      {/* Additional atmospheric elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-${i + 1} h-${i + 1} bg-white rounded-full opacity-30`}
            style={{
              top: `${20 + i * 30}%`,
              left: `${15 + i * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
export default MainContainer;