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
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);

  const handleButtonClick = async () => {
    setIsLoading(true);
    // validation the form data
    const message = checkValideData(
      email.current.value,
      password.current.value
    );

    setErrorMassage(message);
    if (message) {
      setIsLoading(false);
      return;
    }
    
    try {
      if (!isSignInForm) {
        // sign up logic
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.current.value,
          password.current.value
        );
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: name.current.value,
          photoURL: USER_AVATAR,
        });
        const { uid, email: userEmail, displayname, photoURL } = auth.currentUser;
        dispatch(
          addUser({
            uid: uid,
            email: userEmail,
            displayname: displayname,
            photoURL: photoURL,
          })
        );
      } else {
        // sign In logic
        await signInWithEmailAndPassword(
          auth,
          email.current.value,
          password.current.value
        );
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setErrorMassage(errorCode + " - " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMassage(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      {/* Background with overlay */}
      <div className="absolute inset-0 scale-in">
        <img 
          className="w-full h-full object-cover scale-105" 
          src={BG_URL} 
          alt="background" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60"></div>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full opacity-60 float"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-40 float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-red-400 rounded-full opacity-50 float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg scale-in">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="p-6 sm:p-8 md:p-12 glass-dark rounded-2xl text-white shadow-2xl border border-white/10"
          >
            <div className="text-center mb-8 fade-in">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-glow mb-2 slide-in-down">
                {isSignInForm ? "Welcome Back" : "Join Netflix"}
              </h1>
              <p className="text-gray-300 text-sm sm:text-base slide-in-up" style={{animationDelay: '0.3s'}}>
                {isSignInForm ? "Sign in to continue watching" : "Create your account to get started"}
              </p>
            </div>
            
            <div className="space-y-4">
              {!isSignInForm && (
                <div className="fade-in" style={{animationDelay: '0.2s'}}>
                  <input
                    ref={name}
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-3 sm:p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:scale-105 focus:scale-105"
                  />
                </div>
              )}
              
              <div className="fade-in" style={{animationDelay: '0.4s'}}>
                <input
                  ref={email}
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 sm:p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:scale-105 focus:scale-105"
                />
              </div>

              <div className="fade-in" style={{animationDelay: '0.6s'}}>
                <input
                  ref={password}
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 sm:p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:scale-105 focus:scale-105"
                />
              </div>
            </div>

            {errorMassage && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg slide-in-up">
                <p className="text-red-300 text-sm text-center">{errorMassage}</p>
              </div>
            )}

            <button
              className="w-full mt-6 p-3 sm:p-4 btn-netflix text-white rounded-xl font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-2xl fade-in"
              style={{animationDelay: '0.8s'}}
              onClick={handleButtonClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spinner mr-2"></div>
                  Processing...
                </>
              ) : (
                isSignInForm ? "Sign In" : "Sign Up"
              )}
            </button>
            
            <div className="mt-6 text-center fade-in" style={{animationDelay: '1s'}}>
              <p className="text-gray-300 text-sm sm:text-base">
                {isSignInForm ? "New to Netflix? " : "Already have an account? "}
                <button 
                  onClick={toggleSignInForm}
                  className="text-red-400 hover:text-red-300 font-semibold hover:underline transition-all duration-300 hover:scale-105"
                >
                  {isSignInForm ? "Sign up now" : "Sign in"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;