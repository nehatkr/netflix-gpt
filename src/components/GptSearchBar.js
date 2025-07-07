import { useRef, useState } from "react";
import lang from "../utils/languageConstants";
import { useDispatch, useSelector } from "react-redux";
import openai from "../utils/openai";
import { API_OPTIONS } from "../utils/constants";
import { addGptMovieResult } from "../utils/gptSlice";
import { motion } from "framer-motion";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);
  const [isSearching, setIsSearching] = useState(false);

  // search movies in TMDB
  const searchMovieTMDB = async (movie) => {
    try {
      const data = await fetch(
        "https://api.themoviedb.org/3/search/movie?query=" +
          movie +
          "&include_adult=false&language=en-US&page=1",
        API_OPTIONS
      );
      const json = await data.json();
      return json.results;
    } catch (error) {
      console.error("Error searching movie in TMDB:", error);
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
          "only give me names of 5 movies, comma seperated like the example result given ahead .Example Results: Gadar, Sholay , Don , Golmaal , koi mil Gaya ";

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

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pt-[10%] sm:pt-[8%] md:pt-[10%] flex justify-center px-4"
    >
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
        <motion.div 
          variants={itemVariants}
          className="text-center mb-8"
        >
          <motion.h1 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-glow mb-2"
          >
            🤖 AI Movie Search
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-300 text-sm sm:text-base"
          >
            Discover your next favorite movie with AI-powered recommendations
          </motion.p>
        </motion.div>
        
        <motion.form
          variants={itemVariants}
          className="glass-dark grid grid-cols-12 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
          onSubmit={(e) => e.preventDefault()}
        >
          <motion.input
            whileFocus={{ scale: 1.02 }}
            ref={searchText}
            type="text"
            className="p-4 sm:p-5 col-span-8 sm:col-span-9 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
            placeholder={lang[langKey]?.gptSearchPlaceholder}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="col-span-4 sm:col-span-3 py-2 px-2 sm:py-2 sm:px-4 btn-netflix text-white font-bold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            onClick={handleGptSearchClick}
            disabled={isSearching}
          >
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                <span className="hidden sm:inline">{lang[langKey]?.search}</span>
                <span className="sm:hidden">🔍</span>
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};
export default GptSearchBar;