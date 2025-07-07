import { BG_URL } from "../utils/constants";
import GptMovieSuggestion from "./GptMovieSuggestion";
import GptSearchBar from "./GptSearchBar";
import { motion } from "framer-motion";

const GptSearch = () => {
  const floatingParticles = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className={`absolute w-${Math.random() > 0.5 ? '32' : '24'} h-${Math.random() > 0.5 ? '32' : '24'} bg-purple-500/10 rounded-full blur-xl`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 20, -10, 0],
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.3, 0.1]
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        delay: Math.random() * 2
      }}
    />
  ));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen relative"
    >
      <div className="fixed inset-0 -z-10">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          className="w-full h-full object-cover" 
          src={BG_URL} 
          alt="background" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black/60 to-blue-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60"></div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingParticles}
      </div>
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 pt-20 sm:pt-24 md:pt-28"
      >
        <GptSearchBar />
        <GptMovieSuggestion />
      </motion.div>
    </motion.div>
  );
};
export default GptSearch;