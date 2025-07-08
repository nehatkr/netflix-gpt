import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import MovieCard from "./movieCard";

const WatchLater = () => {
  const user = useSelector((store) => store.user);
  const [watchLaterList, setWatchLaterList] = useState([]);
  const [sortBy, setSortBy] = useState("dateAdded");

  useEffect(() => {
    // Load watch later list from localStorage
    const savedList = JSON.parse(localStorage.getItem(`watchLater_${user?.uid}`)) || [];
    setWatchLaterList(savedList);
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
        {/* Header Section */}
        <div className="mb-8 fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-glow-red mb-2">
                📺 Watch Later
              </h1>
              <p className="text-gray-300">
                {watchLaterList.length} {watchLaterList.length === 1 ? 'movie' : 'movies'} saved for later
              </p>
            </div>
            
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="dateAdded">Date Added</option>
                <option value="title">Title</option>
                <option value="rating">Rating</option>
                <option value="year">Release Year</option>
              </select>
              
              {watchLaterList.length > 0 && (
                <button
                  onClick={clearAllWatchLater}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
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
                  className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                  title="Remove from Watch Later"
                >
                  <span className="text-white text-sm">✕</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 fade-in">
            <div className="text-8xl mb-6">📺</div>
            <h2 className="text-2xl font-bold mb-4 text-glow">Your Watch Later List is Empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Browse movies and add them to your watch later list to keep track of what you want to watch next.
            </p>
            <button
              onClick={() => window.history.back()}
              className="btn-netflix px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Browse Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchLater;