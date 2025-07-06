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
        // User is signed in then i will get my user over here
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
        // User is signed out
        dispatch(removeUser());
        navigate("/");
      }
    });
    //Unsubcribe when component unmounts
    return () => unsubscribe();
  }, []);

  const handleGptSearchClick = () => {
    // Toggle GPT search
    dispatch(toggleGptSearchView());
  };

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  return (
    <div className="absolute w-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-gradient-to-b from-black z-10 flex flex-col sm:flex-row justify-between items-center">
      <img className="w-32 sm:w-36 md:w-44 mb-2 sm:mb-0" src={LOGO} alt="logo" />
      {user && (
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3">
          {showGptSearch && (
            <select
              className="px-2 py-1 sm:p-2 text-sm sm:text-base bg-gray-700 text-white rounded-lg"
              onChange={handleLanguageChange}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.identifier} value={lang.identifier}>
                  {lang.name}
                </option>
              ))}
            </select>
          )}

          <button
            className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition-colors"
            onClick={handleGptSearchClick}
          >
            {showGptSearch ? "HomePage" : "GPT Search"}
          </button>
          
          <img 
            className="hidden sm:block w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full" 
            alt="userIcon" 
            src={user?.photoURL || "https://occ-0-4345-3647.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXz4LMjJFidX8MxhZ6qro8PBTjmHbxlaLAbk45W1DXbKsAIOwyHQPiMAuUnF1G24CLi7InJHK4Ge4jkXul1xIW49Dr5S7fc.png?r=e6e"} 
          />
          
          <button 
            onClick={handleSignOut} 
            className="text-sm sm:text-base font-bold text-white hover:text-gray-300 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
export default Header;