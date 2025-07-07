import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, SUPPORTED_LANGUAGES } from "../utils/constants";
import { toggleGptSearchView } from "../utils/gptSlice";
import { changeLanguage } from "../utils/configSlice";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent z-50 flex flex-col sm:flex-row justify-between items-center backdrop-blur-sm"
    >
      {/* Logo with enhanced animation */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-2 sm:mb-0"
      >
        <motion.img 
          whileHover={{ scale: 1.05, rotate: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-32 sm:w-36 md:w-44 cursor-pointer filter drop-shadow-lg" 
          src={LOGO} 
          alt="Netflix Logo" 
        />
      </motion.div>
      
      {user && (
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3"
        >
          {/* Language selector with enhanced styling */}
          {showGptSearch && (
            <motion.select
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-2 text-sm sm:text-base bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 hover:bg-white/20 cursor-pointer"
              onChange={handleLanguageChange}
            >
              {SUPPORTED_LANGUAGES.slice(0, 10).map((lang) => (
                <option key={lang.identifier} value={lang.identifier} className="bg-gray-800 text-white">
                  {lang.name}
                </option>
              ))}
            </motion.select>
          )}

          {/* GPT Search button with enhanced effects */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm sm:text-base rounded-lg btn-primary text-white font-semibold shadow-lg relative overflow-hidden group"
            onClick={handleGptSearchClick}
          >
            <motion.span 
              className="relative z-10 flex items-center"
              whileHover={{ rotate: showGptSearch ? 0 : 12 }}
              transition={{ duration: 0.3 }}
            >
              <span className="mr-2">
                {showGptSearch ? "🏠" : "🤖"}
              </span>
              {showGptSearch ? "Home" : "GPT Search"}
            </motion.span>
          </motion.button>
          
          {/* User section with enhanced styling */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 1.0 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <motion.img 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white/30 hover:border-red-500 cursor-pointer shadow-lg" 
              alt="User Avatar" 
              src={user?.photoURL || "https://occ-0-4345-3647.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXz4LMjJFidX8MxhZ6qro8PBTjmHbxlaLAbk45W1DXbKsAIOwyHQPiMAuUnF1G24CLi7InJHK4Ge4jkXul1xIW49Dr5S7fc.png?r=e6e"} 
            />
            
            <motion.button 
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut} 
              className="text-sm sm:text-base font-semibold text-white hover:text-red-400 transition-all duration-300 px-3 py-1 rounded-lg hover:bg-white/10 relative overflow-hidden group"
            >
              <span className="relative z-10">Sign Out</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
export default Header;