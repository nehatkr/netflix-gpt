import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({ movieId }) => {
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);
  useMovieTrailer(movieId);
  
  // Enhanced loading state with cinematic feel
  if (!trailerVideo) {
    return (
      <div className="w-screen aspect-video bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center relative overflow-hidden transition-all duration-500">
        {/* Animated background elements */}
        <div className="absolute inset-0 transition-opacity duration-500">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-xl float"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-xl float" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Loading content */}
        <div className="text-white text-center relative z-10 transition-all duration-500">
          <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full spinner mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold mb-2 text-glow">Loading Cinematic Experience</h3>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        {/* Shimmer overlay */}
        <div className="absolute inset-0 shimmer opacity-30 transition-opacity duration-500"></div>
      </div>
    );
  }
  
  return (
    <div className="w-screen relative overflow-hidden transition-all duration-500">
      {/* Enhanced gradient overlays for cinematic effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/50 z-10 transition-opacity duration-500"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 transition-opacity duration-500"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10 transition-opacity duration-500"></div>
      
      {/* Floating particles for atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20 transition-opacity duration-500">
        <div className="absolute top-1/6 left-1/5 w-1 h-1 bg-white rounded-full opacity-60 particle"></div>
        <div className="absolute top-1/4 right-1/3 w-0.5 h-0.5 bg-red-400 rounded-full opacity-40 particle" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/3 left-2/3 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-30 particle" style={{animationDelay: '5s'}}></div>
        <div className="absolute top-2/3 right-1/5 w-0.5 h-0.5 bg-blue-400 rounded-full opacity-50 particle" style={{animationDelay: '7s'}}></div>
      </div>
      
      {/* Video with enhanced styling */}
      <div className="relative transition-all duration-700 ease-out">
        <iframe
          className="w-screen aspect-video scale-125 sm:scale-110 md:scale-100 transition-all duration-700 ease-out"
          src={`https://www.youtube.com/embed/${trailerVideo?.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${trailerVideo?.key}&start=0&enablejsapi=1&origin=${window.location.origin}`}
          title="Movie Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="eager"
        ></iframe>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};
export default VideoBackground;