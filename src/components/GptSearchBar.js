import { useRef, useState } from "react";
import lang from "../utils/languageConstants";
import { useDispatch, useSelector } from "react-redux";
import openai from "../utils/openai";
import { API_OPTIONS, buildTMDBUrl, checkTMDBKey, TMDB_ERROR_CODES } from "../utils/constants";
import { addGptMovieResult } from "../utils/gptSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);
  const [isSearching, setIsSearching] = useState(false);

  // search movies in TMDB
  const searchMovieTMDB = async (movie) => {
    // Check if TMDB API key is configured
    if (!checkTMDBKey()) {
      console.error("TMDB API key not configured. Please add REACT_APP_TMDB_API_KEY to your .env file");
      console.error("Get your API key from: https://www.themoviedb.org/settings/api");
      return [];
    }

    try {
      const url = buildTMDBUrl(`/search/movie?query=${encodeURIComponent(movie)}&include_adult=false&language=en-US&page=1`);
      console.log('Searching movie in TMDB:', url.replace(/api_key=[^&]+/, 'api_key=***'));
      
      const response = await fetch(url, API_OPTIONS);
      const data = await response.json();
      
      if (!response.ok) {
        // Handle TMDB API specific errors
        const errorCode = data.status_code;
        const errorMessage = data.status_message || `HTTP ${response.status}`;
        
        if (errorCode && TMDB_ERROR_CODES[errorCode]) {
          console.error(`TMDB API Error ${errorCode}: ${TMDB_ERROR_CODES[errorCode]}`);
        } else {
          console.error(`TMDB API Error: ${errorMessage}`);
        }
        
        // Handle specific error cases
        if (errorCode === 7 || errorCode === 24 || errorCode === 26 || errorCode === 28) {
          console.error("Invalid API key. Please check your TMDB API key in the .env file");
        } else if (errorCode === 25) {
          console.error("API key has expired. Please generate a new one from TMDB");
        } else if (errorCode === 23) {
          console.error("Rate limit exceeded. Please wait before making more requests");
        }
        
        return [];
      }
      
      console.log(`Movie search for "${movie}" found ${data.results?.length || 0} results`);
      return data.results || [];
    } catch (error) {
      console.error("Network error searching movie in TMDB:", error);
      return [];
    }
  };

  const handleGptSearchClick = async () => {
    if (!searchText.current.value.trim()) {
      alert("Please enter a search query.");
      return;
    }

    setIsSearching(true);
    console.log(searchText.current.value);
    
    try {
      let gptMovies;
      
      if (!openai) {
        // Fallback: Use predefined movie suggestions when OpenAI is not available
        const fallbackMovies = [
          "The Shawshank Redemption",
          "The Godfather", 
          "The Dark Knight",
          "Pulp Fiction",
          "Forrest Gump"
        ];
        gptMovies = fallbackMovies;
        console.log("Using fallback movie suggestions");
      } else {
        // Use OpenAI for movie recommendations
        const gptQuery =
          "Act as a Movies Recommendation system and suggest some movies for the query: " +
          searchText.current.value +
          ". Only give me names of 5 movies, comma separated like the example result given ahead. Example Results: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";

        const gptResults = await openai.chat.completions.create({
          messages: [{ role: "user", content: gptQuery }],
          model: "gpt-3.5-turbo",
        });
        
        console.log(gptResults.choices?.[0]?.message?.content);
        gptMovies = gptResults.choices?.[0]?.message?.content.split(",");
      }

      // For each movie, search TMDB API
      const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie.trim()));
      const tmdbResults = await Promise.all(promiseArray);
      
      dispatch(
        addGptMovieResult({ movieNames: gptMovies, movieResults: tmdbResults })
      );
    } catch (error) {
      console.error("Error with GPT search:", error);
      
      // Fallback to predefined suggestions on error
      const fallbackMovies = [
        "The Shawshank Redemption",
        "The Godfather", 
        "The Dark Knight",
        "Pulp Fiction",
        "Forrest Gump"
      ];
      
      const promiseArray = fallbackMovies.map((movie) => searchMovieTMDB(movie));
      const tmdbResults = await Promise.all(promiseArray);
      
      dispatch(
        addGptMovieResult({ movieNames: fallbackMovies, movieResults: tmdbResults })
      );
      
      alert("Using fallback movie recommendations. For AI-powered suggestions, please configure your OpenAI API key.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="pt-[10%] sm:pt-[8%] md:pt-[10%] flex justify-center px-4 transition-all duration-500 ease-out">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
        <div className="text-center mb-8 transition-all duration-500">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-glow mb-2 transition-all duration-500">
            🤖 AI Movie Search
          </h1>
          <p className="text-gray-300 text-sm sm:text-base transition-all duration-500 delay-150">
            Discover your next favorite movie with AI-powered recommendations
          </p>
        </div>
        
        <form
          className="glass-dark grid grid-cols-12 rounded-2xl shadow-2xl border border-white/10 overflow-hidden transition-all duration-500 delay-300 hover:shadow-3xl hover:border-white/20"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            ref={searchText}
            type="text"
            className="p-4 sm:p-5 col-span-8 sm:col-span-9 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base transition-all duration-300 focus:bg-white/5"
            placeholder={lang[langKey]?.gptSearchPlaceholder}
          />
          <button
            className="col-span-4 sm:col-span-3 py-2 px-2 sm:py-2 sm:px-4 btn-netflix text-white font-bold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={handleGptSearchClick}
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spinner"></div>
            ) : (
              <>
                <span className="hidden sm:inline">{lang[langKey]?.search}</span>
                <span className="sm:hidden">🔍</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default GptSearchBar;