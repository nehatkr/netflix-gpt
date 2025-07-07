const VideoTitle = ({ title, overview }) => {
  return (
    <div className="w-screen aspect-video pt-[15%] sm:pt-[12%] md:pt-[20%] px-4 sm:px-6 md:px-12 lg:px-24 absolute text-white z-20">
      {/* Cinematic bars for movie feel */}
      <div className="cinematic-bars"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full opacity-60 particle"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full opacity-40 particle" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-red-400 rounded-full opacity-50 particle" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-30 particle" style={{animationDelay: '6s'}}></div>
      </div>
      
      <div className="bg-gradient-to-r from-black/95 via-black/70 to-transparent p-6 sm:p-8 md:p-10 rounded-2xl backdrop-blur-sm relative overflow-hidden fade-in">
        {/* Animated background pattern */}
        <div className="absolute inset-0 pattern-animate opacity-20"></div>
        
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4 leading-tight text-glow-red slide-in-left">
            {title}
          </h1>
          <p className="hidden sm:block py-2 md:py-6 text-sm sm:text-base md:text-lg w-full sm:w-3/4 md:w-1/2 leading-relaxed text-gray-200 slide-in-right" style={{animationDelay: '0.3s'}}>
            {overview}
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 my-4 md:my-6">
            <button className="flex items-center justify-center bg-white text-black py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 text-sm sm:text-base md:text-lg font-bold rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg btn-primary slide-in-up group" style={{animationDelay: '0.6s'}}>
              <span className="mr-2 text-lg group-hover:scale-110 transition-transform duration-300">▶️</span>
              <span className="relative overflow-hidden">
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">Play</span>
                <span className="absolute top-full left-0 transition-transform duration-300 group-hover:-translate-y-full">Play</span>
              </span>
            </button>
            <button className="hidden sm:flex items-center justify-center bg-white/20 backdrop-blur-sm text-white py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 text-sm sm:text-base md:text-lg font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30 shadow-lg glow-border group slide-in-up" style={{animationDelay: '0.9s'}}>
              <span className="mr-2 group-hover:rotate-12 transition-transform duration-300">ℹ️</span>
              <span className="relative overflow-hidden">
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">More Info</span>
                <span className="absolute top-full left-0 transition-transform duration-300 group-hover:-translate-y-full">More Info</span>
              </span>
            </button>
          </div>
          
          {/* Additional movie stats with animations */}
          <div className="hidden md:flex items-center space-x-6 mt-6 slide-in-up" style={{animationDelay: '1.2s'}}>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span className="w-2 h-2 bg-green-500 rounded-full breathe"></span>
              <span>HD</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span className="w-2 h-2 bg-yellow-500 rounded-full breathe" style={{animationDelay: '1s'}}></span>
              <span>Dolby Vision</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span className="w-2 h-2 bg-blue-500 rounded-full breathe" style={{animationDelay: '2s'}}></span>
              <span>5.1 Surround</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoTitle;