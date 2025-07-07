import { IMG_CDN_URL } from "../utils/constants";

const MovieCard = ({ posterPath, title, rating, year }) => {
  if (!posterPath) return null;
  
  return (
    <div className="w-28 sm:w-32 md:w-36 lg:w-48 flex-shrink-0 card-hover cursor-pointer group movie-card-glow fade-in-stagger">
      <div className="relative overflow-hidden rounded-xl shadow-xl bg-gray-900">
        {/* Main poster image */}
        <div className="relative overflow-hidden">
          <img 
            className="w-full h-auto transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" 
            alt={title || "Movie Poster"} 
            src={IMG_CDN_URL + posterPath} 
            loading="lazy"
          />
          
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-all duration-500">
          {/* Movie info */}
          <div className="mb-3">
            {title && (
              <h4 className="text-white text-xs font-semibold mb-1 line-clamp-2 text-glow">
                {title}
              </h4>
            )}
            <div className="flex items-center justify-between text-xs text-gray-300">
              {rating && (
                <span className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  {rating}
                </span>
              )}
              {year && <span>{year}</span>}
              }
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-center space-x-2">
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 shadow-lg group/btn">
              <span className="text-black text-xs group-hover/btn:scale-125 transition-transform duration-300">▶️</span>
            </button>
            <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110 border border-white/30 shadow-lg group/btn">
              <span className="text-white text-xs group-hover/btn:rotate-180 transition-transform duration-500">+</span>
            </button>
            <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110 border border-white/30 shadow-lg group/btn">
              <span className="text-white text-xs group-hover/btn:scale-125 transition-transform duration-300">👍</span>
            </button>
          </div>
        </div>
        
        {/* Floating quality badge */}
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
          HD
        </div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
             style={{
               background: 'linear-gradient(45deg, transparent, rgba(229, 9, 20, 0.1), transparent)',
               animation: 'shimmer 2s infinite'
             }}>
        </div>
      </div>
    </div>
  );
};
export default MovieCard;