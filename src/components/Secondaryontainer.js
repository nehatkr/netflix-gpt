import MovieList from "./movieList";
import { useSelector } from "react-redux";

const SecondaryContainer = () => {
  const movies = useSelector(store => store.movies);
  
  // Enhanced loading state
  if (!movies.nowPlayingMovies) {
    return (
      <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex items-center justify-center relative overflow-hidden fade-in">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/5 rounded-full blur-xl float"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-purple-500/5 rounded-full blur-xl float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="text-white text-center relative z-10 scale-in">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full spinner mx-auto mb-4"></div>
          <h3 className="text-xl font-bold mb-2 text-glow">Curating Movie Collections</h3>
          <p className="text-gray-400">Discovering the best content for you...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden fade-in">
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-animate opacity-5"></div>
      
      <div className="mt-0 md:-mt-20 lg:-mt-52 relative z-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-8">
        {/* Section header */}
        <div className="text-center py-8 slide-in-down">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-glow mb-2">
            Discover Amazing Content
          </h2>
          <p className="text-gray-400 text-lg">
            Handpicked collections just for you
          </p>
        </div>
        
        <div className="space-y-8 overflow-visible">
          {movies.nowPlayingMovies && (
            <div className="fade-in" style={{animationDelay: '0.1s'}}>
              <MovieList title={"🔥 Now Playing"} movies={movies.nowPlayingMovies} />
            </div>
          )}
          {movies.topRatedMovies && (
            <div className="fade-in" style={{animationDelay: '0.2s'}}>
              <MovieList title={"⭐ Top Rated"} movies={movies.topRatedMovies} />
            </div>
          )}
          {movies.popularMovies && (
            <div className="fade-in" style={{animationDelay: '0.3s'}}>
              <MovieList title={"🎭 Popular"} movies={movies.popularMovies} />
            </div>
          )}
          {movies.upcomingMovies && (
            <div className="fade-in" style={{animationDelay: '0.4s'}}>
              <MovieList title={"🚀 Upcoming Movies"} movies={movies.upcomingMovies} />
            </div>
          )}
          {movies.nowPlayingMovies && (
            <div className="fade-in" style={{animationDelay: '0.5s'}}>
              <MovieList title={"🎬 Netflix Originals"} movies={movies.nowPlayingMovies.slice(0, 10)} />
            </div>
          )}
          {movies.popularMovies && (
            <div className="fade-in" style={{animationDelay: '0.6s'}}>
              <MovieList title={"👻 Thriller & Horror"} movies={movies.popularMovies.slice(5, 15)} />
            </div>
          )}
        </div>
        
        {/* Footer section */}
        <div className="text-center py-12 slide-in-up" style={{animationDelay: '1s'}}>
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-red-500 rounded-full breathe"></div>
            <span>More content loading...</span>
            <div className="w-2 h-2 bg-red-500 rounded-full breathe" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryContainer;