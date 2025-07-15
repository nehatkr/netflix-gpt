import { useSelector } from "react-redux";
import VideoBackground from "./VideoBackground";
import VideoTitle from "./VideoTitle";

const MainContainer = () => {
  const movies = useSelector(store => store.movies?.nowPlayingMovies);
  
  // Enhanced loading state with cinematic feel
  if (!movies || movies.length === 0) {
    return (
      <div className="pt-[30%] sm:pt-[25%] md:pt-0 bg-black relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 transition-opacity duration-500">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-xl float"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-xl float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-yellow-500/10 rounded-full blur-xl float" style={{animationDelay: '3s'}}></div>
        </div>
        
        {/* Loading content */}
        <div className="text-white text-center relative z-10 transition-all duration-500">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full spinner mx-auto mb-6"></div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-glow-red">
            Loading Movies
          </h2>
          <p className="text-gray-300 text-lg mb-6 transition-opacity duration-500">
            Fetching movie data from TMDB...
          </p>
          <div className="text-sm text-gray-500 mt-4">
            <p>If this takes too long, please check your TMDB API key configuration</p>
          </div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        {/* Shimmer overlay */}
        <div className="absolute inset-0 shimmer opacity-20"></div>
      </div>
    );
  }

  // Select a random movie from the first 5 for variety
  const randomIndex = Math.floor(Math.random() * Math.min(5, movies.length));
  const mainMovies = movies[randomIndex];
  const { original_title, overview, id } = mainMovies;

  return (
    <div className="pt-[30%] sm:pt-[25%] md:pt-0 bg-black relative overflow-hidden transition-all duration-500">
      {/* Enhanced video title with animations */}
      <div className="transition-all duration-500 ease-out">
        <VideoTitle title={original_title} overview={overview} />
      </div>
      
      {/* Enhanced video background */}
      <div className="transition-all duration-500 ease-out">
        <VideoBackground movieId={id} />
      </div>
      
      {/* Additional atmospheric elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-500">
        <div className="absolute top-1/6 left-1/6 w-2 h-2 bg-white rounded-full opacity-30 particle"></div>
        <div className="absolute top-1/4 right-1/5 w-1 h-1 bg-red-400 rounded-full opacity-40 particle" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-25 particle" style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  );
};
export default MainContainer;