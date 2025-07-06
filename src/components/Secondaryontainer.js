import MovieList from "./movieList";
import { useSelector } from "react-redux";

const SecondaryContainer = () => {
  const movies = useSelector(store => store.movies);
  
  // Don't render if no movies are loaded yet
  if (!movies.nowPlayingMovies) {
    return (
      <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full spinner mx-auto mb-4"></div>
          <p className="text-lg">Loading movie collections...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="mt-0 md:-mt-20 lg:-mt-52 relative z-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-8">
        <div className="space-y-6">
          {movies.nowPlayingMovies && (
            <MovieList title={"🔥 Now Playing"} movies={movies.nowPlayingMovies} />
          )}
          {movies.topRatedMovies && (
            <MovieList title={"⭐ Top Rated"} movies={movies.topRatedMovies} />
          )}
          {movies.popularMovies && (
            <MovieList title={"🎭 Popular"} movies={movies.popularMovies} />
          )}
          {movies.upcomingMovies && (
            <MovieList title={"🚀 Upcoming Movies"} movies={movies.upcomingMovies} />
          )}
          {movies.nowPlayingMovies && (
            <MovieList title={"👻 Horror"} movies={movies.nowPlayingMovies} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondaryContainer;