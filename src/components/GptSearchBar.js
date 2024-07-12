import { useRef } from "react";
import lang from "../utils/languageConstants";
import { useDispatch, useSelector } from "react-redux";
import openai from "../utils/openai";
import { API_OPTIONS } from "../utils/constants";
import { addGptMovieResult } from "../utils/gptSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang); //use lang[langKey] on place of hindi
  const searchText = useRef(null);

  //   search movies in TMDB
  const searchMovieTMDB = async (movie) => {
    const data = await fetch(
      "https://api.themoviedb.org/3/search/movie?query=" +
        movie +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS
    );
    const json = await data.json();
    return json.gptResults;
  };

  const handleGptSearchClick = async () => {
    console.log(searchText.current.value);
    // Make an Api call to get the movie results
    const gptQuery =
      "Act as a Movies Recommendation system and suggest some movies for the query: " +
      searchText.current.value +
      "only give me names of 5 movies, comma seperated like the example result given ahead .Example Results: Gadar, Sholay , Don , Golmaal , koi mil Gaya ";

    const gptResults = await openai.chat.completions.create({
      messages: [{ role: "user", content: gptQuery }],
      model: "gpt-3.5-turbo",
    });
    console.log(gptResults.choices?.[0]?.message?.content);
    // Andaz Apna Apna, Hera Pheri,Chupke Chupke , jaane Bhi Do yaaro, padosan
    const gptMovies = gptResults.choices?.[0]?.message?.content.split(",");

    // [Andaz Apna Apna, Hera Pheri,Chupke Chupke , jaane Bhi Do yaaro, padosan]

    // For each movies I will search TMDB API
    const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
    // this will return array of 5 promises not the result
    const tmdbResults = await Promise.all(promiseArray); //my program will wait for the all the promises are resolve
    dispatch(
      addGptMovieResult({ movieNames: gptMovies, movieResults: tmdbResults })
    );
  };

  return (
    <div className="pt-[50%] md:pt-[10%] flex justify-center">
      <form
        className=" w-full md:w-1/2 bg-black grid grid-cols-12 rounded-lg "
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchText}
          type="text"
          className="p-4 m-4 col-span-9 rounded-lg"
          placeholder={lang[langKey]?.gptSearchPlaceholder}
        />
        <button
          className="col-span-3 py-2 px-4 m-4 bg-red-700 text-white rounded-lg "
          onClick={handleGptSearchClick}
        >
          {lang[langKey]?.search}
        </button>
      </form>
    </div>
  );
};
export default GptSearchBar;
