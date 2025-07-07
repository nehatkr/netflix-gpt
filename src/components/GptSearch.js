import { BG_URL } from "../utils/constants";
import GptMovieSuggestion from "./GptMovieSuggestion";
import GptSearchBar from "./GptSearchBar";

const GptSearch = () => {
  return (
    <div className="min-h-screen relative fade-in">
      <div className="fixed inset-0 -z-10">
        <img 
          className="w-full h-full object-cover scale-105 zoom" 
          src={BG_URL} 
          alt="background" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black/60 to-blue-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60"></div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl float"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-red-500/10 rounded-full blur-xl float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 pt-20 sm:pt-24 md:pt-28 slide-in-up" style={{animationDelay: '0.3s'}}>
        <GptSearchBar />
        <GptMovieSuggestion />
      </div>
    </div>
  );
};
export default GptSearch;