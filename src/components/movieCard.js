import { IMG_CDN_URL } from "../utils/constants";
import { motion } from "framer-motion";

const MovieCard = ({ posterPath, title, rating, year }) => {
  if (!posterPath) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        y: -15, 
        scale: 1.05,
        transition: { type: "spring", stiffness: 300 }
      }}
      className="w-28 sm:w-32 md:w-36 lg:w-48 flex-shrink-0 cursor-pointer group movie-card-glow"
    >
      <div className="relative overflow-hidden rounded-xl shadow-xl bg-gray-900">
        {/* Main poster image */}
        <div className="relative overflow-hidden">
          <motion.img 
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-auto" 
            alt={title || "Movie Poster"} 
            src={IMG_CDN_URL + posterPath} 
            loading="lazy"
          />
          
          {/* Shimmer effect on hover */}
          <motion.div 
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </div>
        
        {/* Gradient overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
        />
        
        {/* Content overlay */}
        <motion.div 
          initial={{ y: "100%" }}
          whileHover={{ y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 p-3"
        >
          {/* Movie info */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-3"
          >
            {title && (
              <h4 className="text-white text-xs font-semibold mb-1 line-clamp-2 text-glow">
                {title}
              </h4>
            )}
            <div className="flex items-center justify-between text-xs text-gray-300">
              {rating && (
                <span className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  {rating}
                </span>
              )}
              {year && <span>{year}</span>}
            </div>
          </motion.div>
          
          {/* Action buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center space-x-2"
          >
            <motion.button 
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 shadow-lg group/btn"
            >
              <span className="text-black text-xs">▶️</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.2, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg group/btn"
            >
              <span className="text-white text-xs">+</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg group/btn"
            >
              <span className="text-white text-xs">👍</span>
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Floating quality badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold"
        >
          HD
        </motion.div>
        
        {/* Hover glow effect */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, transparent, rgba(229, 9, 20, 0.1), transparent)',
          }}
        />
      </div>
    </motion.div>
  );
};
export default MovieCard;