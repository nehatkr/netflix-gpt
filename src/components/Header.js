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
    <div className="absolute w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-50 flex flex-col sm:flex-row justify-between items-center backdrop-blur-sm">
      <div className="mb-2 sm:mb-0">
        <img 
          className="w-32 sm:w-36 md:w-44 hover:scale-105 transition-transform duration-300 cursor-pointer" 
          src={LOGO} 
          alt="Netflix Logo" 
        />
      </div>
      
      {user && (
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3">
          {showGptSearch && (
            <select
              className="px-3 py-2 text-sm sm:text-base bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              onChange={handleLanguageChange}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.identifier} value={lang.identifier} className="bg-gray-800">
                  {lang.name}
                </option>
              ))}
            </select>
          )}

          <button
            className="px-4 py-2 text-sm sm:text-base rounded-lg btn-primary text-white font-semibold shadow-lg"
            onClick={handleGptSearchClick}
          >
            {showGptSearch ? "🏠 Home" : "🤖 GPT Search"}
          </button>
          
          <div className="flex items-center gap-3">
            <img 
              className="hidden sm:block w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white/30 hover:border-white/60 transition-all duration-300 cursor-pointer shadow-lg" 
              alt="User Avatar" 
              src={user?.photoURL || "https://occ-0-4345-3647.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXz4LMjJFidX8MxhZ6qro8PBTjmHbxlaLAbk45W1DXbKsAIOwyHQPiMAuUnF1G24CLi7InJHK4Ge4jkXul1xIW49Dr5S7fc.png?r=e6e"} 
            />
            
            <button 
              onClick={handleSignOut} 
              className="text-sm sm:text-base font-semibold text-white hover:text-red-400 transition-colors duration-300 px-3 py-1 rounded-lg hover:bg-white/10"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Header;