import MovieCard from "./movieCard";

const MovieList = ({ title, movies }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="px-2 sm:px-4 md:px-6 py-4 fade-in">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl py-2 sm:py-4 text-white font-bold text-glow mb-4 slide-in-left">
          {title}
        </h1>
        <div className="flex gap-3 sm:gap-4 md:gap-5">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="w-28 sm:w-32 md:w-36 lg:w-48 flex-shrink-0 fade-in-stagger" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="aspect-[2/3] bg-gray-800 rounded-xl skeleton-dark"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 fade-in">
      {/* Enhanced title with animation */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl py-2 sm:py-4 text-white font-bold text-glow slide-in-left relative">
          {title}
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-transparent group-hover:w-full transition-all duration-500"></div>
        </h1>
        
        {/* View all button */}
        <button className="hidden md:flex items-center text-gray-400 hover:text-white transition-colors duration-300 text-sm group slide-in-right hover:scale-105">
          <span className="mr-1 group-hover:mr-2 transition-all duration-300">View All</span>
          <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
        </button>
      </div>
      
      {/* Movie cards container with enhanced scrolling */}
      <div className="flex overflow-x-scroll scrollbar-hide custom-scrollbar pb-4 relative">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex gap-3 sm:gap-4 md:gap-5 px-2">
          {movies?.map((movie, index) => (
            <div key={movie.id} className="fade-in-stagger" style={{animationDelay: `${index * 0.1}s`}}>
              <MovieCard 
                posterPath={movie.poster_path}
                title={movie.title || movie.original_title}
                rating={movie.vote_average?.toFixed(1)}
                year={movie.release_date?.split('-')[0]}
                movieId={movie.id}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="flex justify-center mt-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full opacity-50 breathe"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full opacity-30 breathe" style={{animationDelay: '0.5s'}}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full opacity-20 breathe" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    </div>
  );
};
export default MovieList;