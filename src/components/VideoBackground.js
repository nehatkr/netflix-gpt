import { useState } from "react";
import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({ movieId }) => {
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useMovieTrailer(movieId);
  
  // Handle video load events
  const handleVideoLoad = () => {
    setIsLoading(false);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setVideoError(true);
  };

  // Fallback for Bolt.new environment
  const isBoltEnvironment = window.location.hostname.includes('bolt.new') || 
                           window.location.hostname.includes('stackblitz') ||
                           window.location.hostname.includes('webcontainer');

  // Enhanced loading state with cinematic feel
  if (!trailerVideo || isLoading) {
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
          {!trailerVideo ? (
            <>
              <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full spinner mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold mb-2 text-glow">Loading Trailer</h3>
              <p className="text-gray-400">Fetching movie trailer...</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full spinner mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold mb-2 text-glow">Loading Video Player</h3>
              <p className="text-gray-400">Initializing video playback...</p>
            </>
          )}
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
  
  // Show error state or fallback for Bolt environment
  if (videoError || isBoltEnvironment) {
    return (
      <div className="w-screen aspect-video bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center relative overflow-hidden">
        {/* Background Image Fallback */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-r from-red-900/20 to-blue-900/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>
        </div>
        
        <div className="text-white text-center relative z-10">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-glow">Video Preview Unavailable</h3>
          <p className="text-gray-400 mb-4">
            {isBoltEnvironment 
              ? "Video playback is restricted in this environment" 
              : "Unable to load video trailer"}
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.open(`https://www.youtube.com/watch?v=${trailerVideo?.key}`, '_blank')}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Watch on YouTube
            </button>
          </div>
        </div>
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
          src={`https://www.youtube.com/embed/${trailerVideo?.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${trailerVideo?.key}&start=0&enablejsapi=1&origin=${window.location.origin}&playsinline=1`}
          title="Movie Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="eager"
          onLoad={handleVideoLoad}
          onError={handleVideoError}
        ></iframe>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};
export default VideoBackground;