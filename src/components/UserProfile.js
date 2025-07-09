import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser } from "../utils/userSlice";
import Header from "./Header";

const UserProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayname || "",
    email: user?.email || "",
  });
  const [watchHistory, setWatchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load user preferences from localStorage
    const savedHistory = JSON.parse(localStorage.getItem(`watchHistory_${user?.uid}`)) || [];
    const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${user?.uid}`)) || [];
    setWatchHistory(savedHistory);
    setFavorites(savedFavorites);
  }, [user?.uid]);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: formData.displayName,
      });
      
      dispatch(addUser({
        uid: user.uid,
        email: user.email,
        displayname: formData.displayName,
        photoURL: user.photoURL,
      }));
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearWatchHistory = () => {
    localStorage.removeItem(`watchHistory_${user?.uid}`);
    setWatchHistory([]);
  };

  const clearFavorites = () => {
    localStorage.removeItem(`favorites_${user?.uid}`);
    setFavorites([]);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-24 px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-red-900/20 to-black/50 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-white/10 fade-in relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <img
                src={user?.photoURL || "https://occ-0-4345-3647.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXz4LMjJFidX8MxhZ6qro8PBTjmHbxlaLAbk45W1DXbKsAIOwyHQPiMAuUnF1G24CLi7InJHK4Ge4jkXul1xIW49Dr5S7fc.png?r=e6e"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-red-500 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left relative z-10">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white w-full max-w-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                    placeholder="Display Name"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isLoading}
                      className="btn-netflix px-6 py-3 rounded-lg disabled:opacity-50 flex items-center gap-2 hover:scale-105 transition-transform duration-300"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-glow-red mb-2">
                    {user?.displayname || "Netflix User"}
                  </h1>
                  <p className="text-gray-300 mb-4">{user?.email}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl fade-in group">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2 group-hover:scale-110 transition-transform duration-300">{watchHistory.length}</div>
              <div className="text-gray-300 font-medium">Movies Watched</div>
              <div className="text-xs text-gray-500 mt-1">Total viewing history</div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl fade-in group" style={{animationDelay: '0.2s'}}>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2 group-hover:scale-110 transition-transform duration-300">{favorites.length}</div>
              <div className="text-gray-300 font-medium">Favorites</div>
              <div className="text-xs text-gray-500 mt-1">Liked movies</div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl fade-in group" style={{animationDelay: '0.4s'}}>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">Premium</div>
              <div className="text-gray-300 font-medium">Account Type</div>
              <div className="text-xs text-gray-500 mt-1">Full access</div>
            </div>
          </div>
        </div>

        {/* Watch History */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8 fade-in" style={{animationDelay: '0.6s'}}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-glow">Watch History</h2>
            {watchHistory.length > 0 && (
              <button
                onClick={clearWatchHistory}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Clear History
              </button>
            )}
          </div>
          {watchHistory.length > 0 ? (
            <div className="space-y-3">
              {watchHistory.slice(0, 5).map((movie, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-16 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-400">Poster</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{movie.title}</h3>
                    <p className="text-gray-400 text-sm">{movie.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-4">📺</div>
              <p>No watch history yet. Start watching to see your history here!</p>
            </div>
          )}
        </div>

        {/* Favorites */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 fade-in" style={{animationDelay: '0.8s'}}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-glow">My Favorites</h2>
            {favorites.length > 0 && (
              <button
                onClick={clearFavorites}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Clear Favorites
              </button>
            )}
          </div>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {favorites.slice(0, 6).map((movie, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-xs text-gray-400">Poster</span>
                  </div>
                  <h4 className="text-sm font-medium truncate">{movie.title}</h4>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-4">❤️</div>
              <p>No favorites yet. Like movies to add them to your favorites!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;