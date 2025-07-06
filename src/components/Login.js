import { checkValideData } from "../utils/validate";
import Header from "./Header";
import { useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BG_URL, USER_AVATAR } from "../utils/constants";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMassage, setErrorMassage] = useState(null);
  const dispatch = useDispatch();

  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);

  const handleButtonClick = () => {
    // validation the form data
    const message = checkValideData(
      email.current.value,
      password.current.value
      // name.current.value
    );

    setErrorMassage(message);
    if (message) return;
    // sign in / sign up
    if (!isSignInForm) {
      // sign up logic
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
            photoURL: USER_AVATAR,
          })
            .then(() => {
              // Profile updated!
              const { uid, email, displayname, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayname: displayname,
                  photoURL: photoURL,
                })
              );
            })
            .catch((error) => {
              // An error occurred
              setErrorMassage(error.massage);
            });

          // console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMassage = error.massage;
          setErrorMassage(errorCode + "-" + errorMassage);
        });
    } else {
      // sign In logic
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          //signed in
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMassage = error.massage;
          setErrorMassage(errorCode + "-" + errorMassage);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  };
  return (
    <div className="min-h-screen">
      <Header />
      <div className="absolute inset-0">
        <img 
          className="w-full h-full object-cover" 
          src={BG_URL} 
          alt="background" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 md:p-12 bg-black bg-opacity-80 rounded-lg text-white"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold py-4 text-center">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h1>
          
          {!isSignInForm && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="p-3 sm:p-4 my-2 sm:my-3 w-full bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          )}
          
          <input
            ref={email}
            type="text"
            placeholder="Email Address"
            className="p-3 sm:p-4 my-2 sm:my-3 w-full bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="p-3 sm:p-4 my-2 sm:my-3 w-full bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <p className="text-red-500 font-bold text-sm sm:text-base py-2 text-center min-h-[2rem]">
            {errorMassage}
          </p>

          <button
            className="p-3 sm:p-4 my-4 sm:my-6 bg-red-700 w-full rounded-lg cursor-pointer hover:bg-red-800 transition-colors font-semibold text-base sm:text-lg"
            onClick={handleButtonClick}
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>
          
          <p className="py-4 cursor-pointer text-center text-sm sm:text-base hover:underline" onClick={toggleSignInForm}>
            {isSignInForm
              ? "New to Netflix? Sign Up Now."
              : "Already registered? Sign In Now."}
          </p>
        </form>
      </div>
    </div>
  );
};
export default Login;