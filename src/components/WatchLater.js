import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import MovieCard from "./movieCard";

const WatchLater = () => {
  const user = useSelector((store) => store.user);
  const [watchLaterList, setWatchLaterList] = useState([]);
  const [sortBy, setSortBy] = useState("dateAdded");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Load watch later list from localStorage
    const savedList = JSON.parse(localStorage.getItem(`watchLater_${user?.uid}`)) || [];
    setWatchLaterList(savedList);

    // Listen for watch later updates from movie cards
    const handleWatchLaterUpdate = (event) => {
      const { action, movie, totalCount } = event.detail;
      
      if (action === 'add') {
        // Refresh the list
        const updatedList = JSON.parse(localStorage.getItem(`watchLater_${user?.uid}`)) || [];
        setWatchLaterList(updatedList);
        
        // Show notification
        setNotification({
          type: 'success',
          message: `"${movie.title}" added to Watch Later`,
          count: totalCount
        });
        
        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      }
    };

    window.addEventListener('watchLaterUpdated', handleWatchLaterUpdate);
    
    return () => {
      window.removeEventListener('watchLaterUpdated', handleWatchLaterUpdate);
    };
  }, [user?.uid]);

  const removeFromWatchLater = (movieId) => {
    const updatedList = watchLaterList.filter(movie => movie.id !== movieId);
    setWatchLaterList(updatedList);
    localStorage.setItem(`watchLater_${user?.uid}`, JSON.stringify(updatedList));
  };

  const clearAllWatchLater = () => {
    setWatchLaterList([]);
    localStorage.removeItem(`watchLater_${user?.uid}`);
  };

  const sortedList = [...watchLaterList].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "rating":
        return b.vote_average - a.vote_average;
      case "year":
        return new Date(b.release_date) - new Date(a.release_date);
      default:
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-24 px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-900/90 border-green-500/50 text-green-100' 
              : 'bg-red-900/90 border-red-500/50 text-red-100'
          } backdrop-blur-sm slide-in-right`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium">{notification.message}</p>
                {notification.count && (
                  <p className="text-sm opacity-75">{notification.count} movies in Watch Later</p>
                )}
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8 fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-glow-red mb-2 flex items-center gap-3">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Later
              </h1>
              <p className="text-gray-300">
                {watchLaterList.length} {watchLaterList.length === 1 ? 'movie' : 'movies'} saved for later
              </p>
            </div>
            
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 hover:bg-white/20"
              >
                <option value="dateAdded">Date Added</option>
                <option value="title">Title</option>
                <option value="rating">Rating</option>
                <option value="year">Release Year</option>
              </select>
              
              {watchLaterList.length > 0 && (
                <button
                  onClick={clearAllWatchLater}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {watchLaterList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {sortedList.map((movie, index) => (
              <div key={movie.id} className="relative group fade-in-stagger" style={{animationDelay: `${index * 0.1}s`}}>
                <MovieCard
                  posterPath={movie.poster_path}
                  title={movie.title || movie.original_title}
                  rating={movie.vote_average?.toFixed(1)}
                  year={movie.release_date?.split('-')[0]}
                  movieId={movie.id}
                />
                
                {/* Remove button */}
                <button
                  onClick={() => removeFromWatchLater(movie.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110"
                  title="Remove from Watch Later"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 fade-in">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-glow">Your Watch Later List is Empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Browse movies and add them to your watch later list to keep track of what you want to watch next.
            </p>
            <button
              onClick={() => window.history.back()}
              className="btn-netflix px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16l13-8z" />
              </svg>
              Browse Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchLater;