import { IMG_CDN_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MovieCard = ({ posterPath, title, rating, year, movieId }) => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  
  if (!posterPath) return null;
  
  const handleCardClick = () => {
    if (movieId) {
      navigate(`/movie/${movieId}`);
    }
  };
  
  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (movieId) {
      navigate(`/movie/${movieId}`);
    }
  };

  const handleAddToListClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    const movie = {
      id: movieId,
      title,
      poster_path: posterPath,
      vote_average: parseFloat(rating) || 0,
      release_date: year ? `${year}-01-01` : new Date().toISOString().split('T')[0],
      dateAdded: new Date().toISOString()
    };
    
    const existingList = JSON.parse(localStorage.getItem(`watchLater_${user.uid}`)) || [];
    const isAlreadyAdded = existingList.some(item => item.id === movieId);
    
    if (!isAlreadyAdded) {
      const updatedList = [...existingList, movie];
      localStorage.setItem(`watchLater_${user.uid}`, JSON.stringify(updatedList));
      // Show success feedback
      const button = e.target.closest('button');
      const originalText = button.innerHTML;
      button.innerHTML = '<span class="text-green-400">✓</span>';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1000);
    } else {
      // Show already added feedback
      const button = e.target.closest('button');
      const originalText = button.innerHTML;
      button.innerHTML = '<span class="text-yellow-400">!</span>';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1000);
    }
  };

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    const movie = {
      id: movieId,
      title,
      poster_path: posterPath,
      vote_average: parseFloat(rating) || 0,
      release_date: year ? `${year}-01-01` : new Date().toISOString().split('T')[0],
      dateAdded: new Date().toISOString()
    };
    
    const existingFavorites = JSON.parse(localStorage.getItem(`favorites_${user.uid}`)) || [];
    const isAlreadyLiked = existingFavorites.some(item => item.id === movieId);
    
    const button = e.target.closest('button');
    const originalText = button.innerHTML;
    
    if (!isAlreadyLiked) {
      const updatedFavorites = [...existingFavorites, movie];
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(updatedFavorites));
      // Show liked feedback
      button.innerHTML = '<span class="text-red-400">❤️</span>';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1000);
    } else {
      // Remove from favorites if already liked
      const updatedFavorites = existingFavorites.filter(item => item.id !== movieId);
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(updatedFavorites));
      // Show removed feedback
      button.innerHTML = '<span class="text-gray-400">💔</span>';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1000);
    }
  };
  
  return (
    <div 
      className="w-28 sm:w-32 md:w-36 lg:w-48 flex-shrink-0 card-hover cursor-pointer group movie-card-glow fade-in-stagger transform transition-all duration-500 hover:z-20 relative"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden rounded-xl shadow-xl bg-gray-900 transition-all duration-500 group-hover:shadow-2xl movie-card-container">
        {/* Main poster image */}
        <div className="relative overflow-hidden">
          <img 
            className="w-full h-auto transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 pointer-events-none" 
            alt={title || "Movie Poster"} 
            src={IMG_CDN_URL + posterPath} 
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x750/1a1a1a/666666?text=No+Image';
            }}
          />
          
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto">
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
                  {parseFloat(rating).toFixed(1)}
                </span>
              )}
              {year && <span>{year}</span>}
              }
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-center space-x-2">
            <button 
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 shadow-lg group/btn pointer-events-auto"
              onClick={handlePlayClick}
              title="Play Movie"
            >
              <span className="text-black text-xs group-hover/btn:scale-125 transition-transform duration-300">▶️</span>
            </button>
            <button 
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110 border border-white/30 shadow-lg group/btn pointer-events-auto"
              onClick={handleAddToListClick}
              title="Add to List"
            >
              <span className="text-white text-xs group-hover/btn:rotate-180 transition-transform duration-500">+</span>
            </button>
            <button 
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110 border border-white/30 shadow-lg group/btn pointer-events-auto"
              onClick={handleLikeClick}
              title="Like"
            >
              <span className="text-white text-xs group-hover/btn:scale-125 transition-transform duration-300">👍</span>
            </button>
          </div>
        </div>
        
        {/* Floating quality badge */}
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 pointer-events-none">
          HD
        </div>
        
        {/* Click indicator */}
        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 pointer-events-none">
          Click to view
        </div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none movie-card-glow-effect" 
             style={{
               background: 'linear-gradient(45deg, transparent, rgba(229, 9, 20, 0.1), transparent)',
             }}>
        </div>
      </div>
    </div>
  );
};
export default MovieCard;