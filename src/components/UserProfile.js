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
        <div className="bg-gradient-to-r from-red-900/20 to-black/50 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-white/10 fade-in">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <img
                src={user?.photoURL || "https://occ-0-4345-3647.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXz4LMjJFidX8MxhZ6qro8PBTjmHbxlaLAbk45W1DXbKsAIOwyHQPiMAuUnF1G24CLi7InJHK4Ge4jkXul1xIW49Dr5S7fc.png?r=e6e"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-red-500 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-xs">Change</span>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white w-full max-w-md"
                    placeholder="Display Name"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isLoading}
                      className="btn-netflix px-6 py-2 rounded-lg disabled:opacity-50"
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-colors"
                    >
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
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors fade-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">{watchHistory.length}</div>
              <div className="text-gray-300">Movies Watched</div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors fade-in" style={{animationDelay: '0.2s'}}>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">{favorites.length}</div>
              <div className="text-gray-300">Favorites</div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors fade-in" style={{animationDelay: '0.4s'}}>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">Premium</div>
              <div className="text-gray-300">Account Type</div>
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