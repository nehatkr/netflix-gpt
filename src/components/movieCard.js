import { IMG_CDN_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react"; // Ensure useState is imported

const MovieCard = ({ posterPath, title, rating, year, movieId }) => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const [isAddingToWatchLater, setIsAddingToWatchLater] = useState(false);
  const [watchLaterStatus, setWatchLaterStatus] = useState('idle'); // 'idle', 'adding', 'success', 'error', 'duplicate'

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

    if (!user) {
      setWatchLaterStatus('error');
      setTimeout(() => setWatchLaterStatus('idle'), 2000);
      return;
    }

    if (isAddingToWatchLater) return; // Prevent multiple clicks

    setIsAddingToWatchLater(true);
    setWatchLaterStatus('adding');

    try {
      // Comprehensive movie data capture
      const movieData = {
        id: movieId,
        title: title || 'Unknown Title',
        original_title: title, // Keep original_title if it's passed, otherwise use title
        poster_path: posterPath,
        vote_average: parseFloat(rating) || 0,
        release_date: year ? `${year}-01-01` : new Date().toISOString().split('T')[0],
        overview: '', // Could be passed as prop if available
        genre_ids: [], // Could be passed as prop if available
        dateAdded: new Date().toISOString(),
        addedBy: user.uid,
        userEmail: user.email
      };

      // Get existing watch later list
      const watchLaterKey = `watchLater_${user.uid}`;
      const existingList = JSON.parse(localStorage.getItem(watchLaterKey)) || [];

      // Check for duplicates
      const isDuplicate = existingList.some(item => item.id === movieId);

      if (isDuplicate) {
        setWatchLaterStatus('duplicate');
        setTimeout(() => setWatchLaterStatus('idle'), 2000);
        setIsAddingToWatchLater(false);
        return;
      }

      // Add movie to watch later list
      const updatedList = [movieData, ...existingList]; // Add to beginning for recent-first order

      // Store in localStorage with error handling
      try {
        localStorage.setItem(watchLaterKey, JSON.stringify(updatedList));

        // Dispatch custom event to update Watch Later UI
        window.dispatchEvent(new CustomEvent('watchLaterUpdated', {
          detail: {
            action: 'add',
            movie: movieData,
            totalCount: updatedList.length
          }
        }));

        setWatchLaterStatus('success');

        // Reset status after animation
        setTimeout(() => {
          setWatchLaterStatus('idle');
        }, 2000);

      } catch (storageError) {
        console.error('Failed to save to localStorage:', storageError);
        setWatchLaterStatus('error');
        setTimeout(() => setWatchLaterStatus('idle'), 2000);
      }

    } catch (error) {
      console.error('Error adding movie to watch later:', error);
      setWatchLaterStatus('error');
      setTimeout(() => setWatchLaterStatus('idle'), 2000);
    } finally {
      setIsAddingToWatchLater(false);
    }
  };

  // This function was duplicated and causing issues.
  // The logic for adding to watch later is now solely within handleAddToListClick.
  // The previous duplicate block has been removed.

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

  // Enhanced visual feedback function
  const getWatchLaterButtonContent = () => {
    switch (watchLaterStatus) {
      case 'adding':
        return <span className="text-blue-400 animate-spin">⟳</span>;
      case 'success':
        return <span className="text-green-400 animate-pulse">✓</span>;
      case 'duplicate':
        return <span className="text-yellow-400 animate-bounce">!</span>;
      case 'error':
        return <span className="text-red-400 animate-pulse">✗</span>;
      default:
        return <span className="text-white group-hover/btn:rotate-180 transition-transform duration-500">+</span>;
    }
  };

  // Get button tooltip based on status
  const getWatchLaterTooltip = () => {
    switch (watchLaterStatus) {
      case 'adding':
        return 'Adding to Watch Later...';
      case 'success':
        return 'Added to Watch Later!';
      case 'duplicate':
        return 'Already in Watch Later';
      case 'error':
        return user ? 'Failed to add' : 'Please sign in';
      default:
        return 'Add to Watch Later';
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
          {/* Corrected: Closed the div tag */}
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
              {/* Corrected: Removed extra closing brace here */}
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
            {/* Corrected: Merged duplicate className attributes */}
            <button
              onClick={handleAddToListClick}
              title={getWatchLaterTooltip()}
              disabled={isAddingToWatchLater}
              className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 border shadow-lg group/btn pointer-events-auto ${
                watchLaterStatus === 'success'
                  ? 'bg-green-500/30 border-green-400/50 hover:bg-green-500/40'
                  : watchLaterStatus === 'duplicate'
                  ? 'bg-yellow-500/30 border-yellow-400/50 hover:bg-yellow-500/40'
                  : watchLaterStatus === 'error'
                  ? 'bg-red-500/30 border-red-400/50 hover:bg-red-500/40'
                  : watchLaterStatus === 'adding'
                  ? 'bg-blue-500/30 border-blue-400/50'
                  : 'bg-white/20 border-white/30 hover:bg-white/30'
              } ${isAddingToWatchLater ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-xs">
                {getWatchLaterButtonContent()}
              </span>
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
