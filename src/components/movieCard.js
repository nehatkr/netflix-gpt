import { IMG_CDN_URL } from "../utils/constants";

const MovieCard = ({ posterPath }) => {
  if (!posterPath) return null;
  
  return (
    <div className="w-28 sm:w-32 md:w-36 lg:w-48 flex-shrink-0 card-hover cursor-pointer group">
      <div className="relative overflow-hidden rounded-xl shadow-xl">
        <img 
          className="w-full h-auto transition-transform duration-500 group-hover:scale-110" 
          alt="Movie Poster" 
          src={IMG_CDN_URL + posterPath} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-center space-x-2">
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="text-black text-xs">▶️</span>
            </button>
            <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <span className="text-white text-xs">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MovieCard;