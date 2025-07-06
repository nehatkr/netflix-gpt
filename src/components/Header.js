import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, SUPPORTED_LANGUAGES } from "../utils/constants";
import { toggleGptSearchView } from "../utils/gptSlice";
import { changeLanguage } from "../utils/configSlice";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

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
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  return (
    <div className="absolute w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent z-50 flex flex-col sm:flex-row justify-between items-center backdrop-blur-sm">
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
              className="px-3 py-2 text-sm sm:text-base bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 hover:bg-white/20 cursor-pointer"
              onChange={handleLanguageChange}
            >
              {SUPPORTED_LANGUAGES.slice(0, 10).map((lang) => (
                <option key={lang.identifier} value={lang.identifier} className="bg-gray-800 text-white">
                  {lang.name}
                </option>
              ))}
            </select>
          )}

          {/* GPT Search button with enhanced effects */}
          <button
            className="px-4 py-2 text-sm sm:text-base rounded-lg btn-primary text-white font-semibold shadow-lg relative overflow-hidden group"
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
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <img 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white/30 hover:border-red-500 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105" 
              alt="User Avatar" 
              src={user?.photoURL || "https://occ-0-4345-3647.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXz4LMjJFidX8MxhZ6qro8PBTjmHbxlaLAbk45W1DXbKsAIOwyHQPiMAuUnF1G24CLi7InJHK4Ge4jkXul1xIW49Dr5S7fc.png?r=e6e"} 
            />
            
            <button 
              onClick={handleSignOut} 
              className="text-sm sm:text-base font-semibold text-white hover:text-red-400 transition-all duration-300 px-3 py-1 rounded-lg hover:bg-white/10 relative overflow-hidden group"
            >
              <span className="relative z-10">Sign Out</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Header;