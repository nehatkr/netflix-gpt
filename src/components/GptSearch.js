import { BG_URL } from "../utils/constants";
import GptMovieSuggestion from "./GptMovieSuggestion";
import GptSearchBar from "./GptSearchBar";

const GptSearch = () => {
  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10">
        <img 
          className="w-full h-full object-cover" 
          src={BG_URL} 
          alt="background" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div className="relative z-10 pt-20 sm:pt-24 md:pt-28">
        <GptSearchBar />
        <GptMovieSuggestion />
      </div>
    </div>
  );
};
export default GptSearch;