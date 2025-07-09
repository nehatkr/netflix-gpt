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

  const navigationItems = [
    {
      path: "/profile",
      label: "My Profile",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: "Manage your account settings"
    },
    {
      path: "/watchlater",
      label: "Watch Later",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Movies saved for later viewing"
    },
    {
      path: "/recommendations",
      label: "Recommendations",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      description: "Personalized movie suggestions"
    }
  ];
  return (
    <div className="absolute w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent z-50 flex flex-col sm:flex-row justify-between items-center backdrop-blur-sm slide-in-down">
      {/* Logo with enhanced animation */}
      <div className="mb-2 sm:mb-0 slide-in-left">
        <img 
          className="w-32 sm:w-36 md:w-44 hover:scale-105 transition-all duration-500 cursor-pointer filter drop-shadow-lg hover:drop-shadow-2xl"
          src={LOGO} 
          alt="Netflix Logo" 
          onClick={() => navigate("/browse")}
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
                <div className="absolute right-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl z-50 fade-in overflow-hidden">
                  {/* User Info Header */}
                  <div className="p-4 border-b border-white/10 bg-gradient-to-r from-red-900/20 to-transparent">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user?.photoURL || "https://occ-0-4345-3647.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXz4LMjJFidX8MxhZ6qro8PBTjmHbxlaLAbk45W1DXbKsAIOwyHQPiMAuUnF1G24CLi7InJHK4Ge4jkXul1xIW49Dr5S7fc.png?r=e6e"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-red-500/50"
                      />
                      <div>
                        <h3 className="text-white font-semibold text-sm truncate max-w-32">
                          {user?.displayname || "Netflix User"}
                        </h3>
                        <p className="text-gray-400 text-xs truncate max-w-32">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Items */}
                  <div className="p-2">
                    {navigationItems.map((item, index) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 flex items-center gap-3 group hover:scale-105 hover:shadow-lg"
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <div className="text-gray-400 group-hover:text-red-400 transition-colors duration-300">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium group-hover:text-red-400 transition-colors duration-300">
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                            {item.description}
                          </div>
                        </div>
                        <div className="text-gray-600 group-hover:text-red-400 transition-all duration-300 transform group-hover:translate-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                    
                    <hr className="border-white/20 my-2" />
                    
                    {/* Sign Out Button */}
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 flex items-center gap-3 group hover:scale-105"
                    >
                      <div className="text-red-400 group-hover:text-red-300 transition-colors duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Sign Out</div>
                        <div className="text-xs text-red-500/70">End your session</div>
                      </div>
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