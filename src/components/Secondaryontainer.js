import MovieList from "./movieList";
import { useSelector } from "react-redux";

const SecondaryContainer = () => {
  const movies = useSelector(store => store.movies);
  
  return (
    movies.nowPlayingMovies && (
      <div className="bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="mt-0 md:-mt-20 lg:-mt-52 relative z-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-8">
          <div className="space-y-6">
            <MovieList title={"🔥 Now Playing"} movies={movies.nowPlayingMovies} />
            <MovieList title={"⭐ Top Rated"} movies={movies.topRatedMovies} />
            <MovieList title={"🎭 Popular"} movies={movies.popularMovies} />
            <MovieList title={"🚀 Upcoming Movies"} movies={movies.upcomingMovies} />
            <MovieList title={"👻 Horror"} movies={movies.nowPlayingMovies} />
          </div>
        </div>
      </div>
    )
  );
};
export default SecondaryContainer;