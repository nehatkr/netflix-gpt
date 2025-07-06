import MovieCard from "./movieCard";

const MovieList = ({ title, movies }) => {
  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 fade-in">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl py-2 sm:py-4 text-white font-bold text-glow mb-4">
        {title}
      </h1>
      <div className="flex overflow-x-scroll scrollbar-hide custom-scrollbar pb-4">
        <div className="flex gap-3 sm:gap-4 md:gap-5">
          {movies?.map((movie) => (
            <MovieCard key={movie.id} posterPath={movie.poster_path} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default MovieList;