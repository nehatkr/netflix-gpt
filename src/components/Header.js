import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, SUPPORTED_LANGUAGES } from "../utils/constants";
import { toggleGptSearchView } from "../utils/gptSlice";
import { changeLanguage } from "../utils/configSlice";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        navigate("/error");
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayname, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayname: displayname,
            photoURL: photoURL,
          })
        );
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  return (
    <div className="absolute w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent z-50 flex flex-col sm:flex-row justify-between items-center backdrop-blur-sm slide-in-down">
      {/* Logo with enhanced animation */}
      <div className="mb-2 sm:mb-0 slide-in-left">
        <img 
          className="w-32 sm:w-36 md:w-44 hover:scale-105 transition-all duration-500 cursor-pointer filter drop-shadow-lg hover:drop-shadow-2xl" 
          src={LOGO} 
          alt="Netflix Logo" 
        />
      </div>
      
      {user && (
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 slide-in-right">
          {/* Language selector with enhanced styling */}
          {showGptSearch && (
            <select
              className="px-3 py-2 text-sm sm:text-base bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 hover:bg-white/20 hover:scale-105 cursor-pointer scale-in"
              onChange={handleLanguageChange}
              style={{animationDelay: '0.3s'}}
            >
              {SUPPORTED_LANGUAGES.slice(0, 15).map((lang) => (
                <option key={lang.identifier} value={lang.identifier} className="bg-gray-800 text-white">
                  {lang.name}
                </option>
              ))}
            </select>
          )}

          {/* GPT Search button with enhanced effects */}
          <button
            className="px-4 py-2 text-sm sm:text-base rounded-lg btn-primary text-white font-semibold shadow-lg relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl scale-in"
            style={{animationDelay: '0.5s'}}
            onClick={handleGptSearchClick}
          >
            <span className="relative z-10 flex items-center">
              <span className="mr-2 group-hover:rotate-12 transition-transform duration-300">
                {showGptSearch ? "🏠" : "🤖"}
              </span>
              {showGptSearch ? "Home" : "GPT Search"}
            </span>
          </button>
          
          {/* User section with enhanced styling */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 scale-in" style={{animationDelay: '0.7s'}}>
            <div className="relative">
              <img 
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white/30 hover:border-red-500 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105" 
                alt="User Avatar" 
                src={user?.photoURL || "https://occ-0-4345-3647.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXz4LMjJFidX8MxhZ6qro8PBTjmHbxlaLAbk45W1DXbKsAIOwyHQPiMAuUnF1G24CLi7InJHK4Ge4jkXul1xIW49Dr5S7fc.png?r=e6e"} 
                onClick={() => setShowUserMenu(!showUserMenu)}
              />
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50 fade-in">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                    >
                      <span>👤</span>
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/watchlater");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                    >
                      <span>📺</span>
                      Watch Later
                    </button>
                    <button
                      onClick={() => {
                        navigate("/recommendations");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                    >
                      <span>🎯</span>
                      Recommendations
                    </button>
                    <hr className="border-white/20 my-2" />
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                    >
                      <span>🚪</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default Header;