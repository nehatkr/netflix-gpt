import { useRef } from "react";
import lang from "../utils/languageConstants";
import { useDispatch, useSelector } from "react-redux";
import openai from "../utils/openai";
import { API_OPTIONS } from "../utils/constants";
import { addGptMovieResult } from "../utils/gptSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);

  // search movies in TMDB
  const searchMovieTMDB = async (movie) => {
    const data = await fetch(
      "https://api.themoviedb.org/3/search/movie?query=" +
        movie +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS
    );
    const json = await data.json();
    return json.results;
  };

  const handleGptSearchClick = async () => {
    if (!openai) {
      alert("OpenAI API key is not configured. Please add your API key to enable GPT search.");
      return;
    }

    console.log(searchText.current.value);
    // Make an Api call to get the movie results
    const gptQuery =
      "Act as a Movies Recommendation system and suggest some movies for the query: " +
      searchText.current.value +
      "only give me names of 5 movies, comma seperated like the example result given ahead .Example Results: Gadar, Sholay , Don , Golmaal , koi mil Gaya ";

    try {
      const gptResults = await openai.chat.completions.create({
        messages: [{ role: "user", content: gptQuery }],
        model: "gpt-3.5-turbo",
      });
      
      console.log(gptResults.choices?.[0]?.message?.content);
      const gptMovies = gptResults.choices?.[0]?.message?.content.split(",");

      // For each movies I will search TMDB API
      const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
      const tmdbResults = await Promise.all(promiseArray);
      
      dispatch(
        addGptMovieResult({ movieNames: gptMovies, movieResults: tmdbResults })
      );
    } catch (error) {
      console.error("Error with GPT search:", error);
      alert("Error occurred during search. Please try again.");
    }
  };

  return (
    <div className="pt-[10%] sm:pt-[8%] md:pt-[10%] flex justify-center px-4">
      <form
        className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-black bg-opacity-80 grid grid-cols-12 rounded-lg shadow-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchText}
          type="text"
          className="p-3 sm:p-4 m-2 sm:m-4 col-span-8 sm:col-span-9 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder={lang[langKey]?.gptSearchPlaceholder}
        />
        <button
          className="col-span-4 sm:col-span-3 py-2 px-2 sm:py-2 sm:px-4 m-2 sm:m-4 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors text-sm sm:text-base font-semibold"
          onClick={handleGptSearchClick}
        >
          {lang[langKey]?.search}
        </button>
      </form>
    </div>
  );
};
export default GptSearchBar;