import { BG_URL } from "../utils/constants";
import GptMovieSuggestion from "./GptMovieSuggestion";
import GptSearchBar from "./GptSearchBar";

const GptSearch = () => {
  return (
    <div className="min-h-screen relative">
      {/* Background with consistent styling */}
      <div className="absolute inset-0 -z-10">
        <img 
          className="w-full h-full object-cover transition-transform duration-700 ease-out" 
          src={BG_URL} 
          alt="background" 
          style={{ transform: 'scale(1.05)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black/70 to-blue-900/30 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70 transition-opacity duration-500"></div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl float transition-all duration-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl float transition-all duration-1000" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-red-500/20 rounded-full blur-xl float transition-all duration-1000" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 pt-20 sm:pt-24 md:pt-28 transition-all duration-500 ease-out">
        <GptSearchBar />
        <GptMovieSuggestion />
      </div>
    </div>
  );
};
export default GptSearch;