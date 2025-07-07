import { motion } from "framer-motion";

const VideoTitle = ({ title, overview }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
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

  const buttonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-screen aspect-video pt-[15%] sm:pt-[12%] md:pt-[20%] px-4 sm:px-6 md:px-12 lg:px-24 absolute text-white z-20"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-${2 + i} h-${2 + i} bg-red-500 rounded-full opacity-60`}
            style={{
              top: `${25 + i * 20}%`,
              left: `${25 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, -5, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 2
            }}
          />
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-black/95 via-black/70 to-transparent p-6 sm:p-8 md:p-10 rounded-2xl backdrop-blur-sm relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <motion.div 
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 pattern-animate opacity-20"
        />
        
        <div className="relative z-10">
          <motion.h1 
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4 leading-tight text-glow-red"
          >
            {title}
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="hidden sm:block py-2 md:py-6 text-sm sm:text-base md:text-lg w-full sm:w-3/4 md:w-1/2 leading-relaxed text-gray-200"
          >
            {overview}
          </motion.p>
          <motion.div 
            variants={containerVariants}
            className="flex flex-wrap gap-3 sm:gap-4 my-4 md:my-6"
          >
            <motion.button 
              variants={buttonVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                boxShadow: "0 10px 30px rgba(255, 255, 255, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center bg-white text-black py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 text-sm sm:text-base md:text-lg font-bold rounded-lg transition-all duration-300 shadow-lg btn-primary group"
            >
              <motion.span 
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="mr-2 text-lg"
              >
                ▶️
              </motion.span>
              <span className="relative overflow-hidden">
                <motion.span 
                  className="block"
                  whileHover={{ y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  Play
                </motion.span>
                <motion.span 
                  className="absolute top-full left-0"
                  whileHover={{ y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  Play
                </motion.span>
              </span>
            </motion.button>
            <motion.button 
              variants={buttonVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                backgroundColor: "rgba(255, 255, 255, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center justify-center bg-white/20 backdrop-blur-sm text-white py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 text-sm sm:text-base md:text-lg font-semibold rounded-lg transition-all duration-300 border border-white/30 shadow-lg glow-border group"
            >
              <motion.span 
                whileHover={{ rotate: 12 }}
                className="mr-2"
              >
                ℹ️
              </motion.span>
              <span className="relative overflow-hidden">
                <motion.span 
                  className="block"
                  whileHover={{ y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  More Info
                </motion.span>
                <motion.span 
                  className="absolute top-full left-0"
                  whileHover={{ y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  More Info
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
          
          {/* Additional movie stats with animations */}
          <motion.div 
            variants={containerVariants}
            className="hidden md:flex items-center space-x-6 mt-6"
          >
            {["HD", "Dolby Vision", "5.1 Surround"].map((feature, index) => (
              <motion.div
                key={feature}
                variants={itemVariants}
                className="flex items-center space-x-2 text-sm text-gray-300"
              >
                <motion.span 
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index
                  }}
                  className={`w-2 h-2 ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : 'bg-blue-500'} rounded-full`}
                />
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default VideoTitle;