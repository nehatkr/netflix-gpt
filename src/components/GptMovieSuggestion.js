import { useSelector } from "react-redux";
import MoviesList from "./movieList";

const GptMovieSuggestion = () => {
  const { movieResults, movieNames } = useSelector((store) => store.gpt);

  if (!movieNames) return null;

  return (
    <div className="p-4 m-2 sm:m-4 glass-dark rounded-2xl border border-white/10 shadow-2xl fade-in">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-glow text-center">
          🎬 AI Recommendations
        </h2>
        <p className="text-gray-300 text-center text-sm sm:text-base mt-2">
          Curated just for you by artificial intelligence
        </p>
      </div>
      <div>
        {movieNames.map((movieName, index) => (
          <MoviesList
            key={movieName}
            title={movieName.trim()}
            movies={movieResults[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default GptMovieSuggestion;