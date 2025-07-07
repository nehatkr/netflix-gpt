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
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingParticles = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className={`absolute w-${Math.random() > 0.5 ? '2' : '1'} h-${Math.random() > 0.5 ? '2' : '1'} bg-red-500 rounded-full opacity-60`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, -5, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.2, 1]
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2
      }}
    />
  ));

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      {/* Background with overlay */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <img 
          className="w-full h-full object-cover" 
          src={BG_URL} 
          alt="background" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60"></div>
      </motion.div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingParticles}
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm sm:max-w-md md:max-w-lg"
        >
          <motion.form
            variants={itemVariants}
            onSubmit={(e) => e.preventDefault()}
            className="p-6 sm:p-8 md:p-12 glass-dark rounded-2xl text-white shadow-2xl border border-white/10"
          >
            <motion.div 
              variants={itemVariants}
              className="text-center mb-8"
            >
              <motion.h1 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-glow mb-2"
              >
                {isSignInForm ? "Welcome Back" : "Join Netflix"}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-gray-300 text-sm sm:text-base"
              >
                {isSignInForm ? "Sign in to continue watching" : "Create your account to get started"}
              </motion.p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="space-y-4"
            >
              {!isSignInForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.input
                    whileFocus={{ scale: 1.02, borderColor: "#ef4444" }}
                    ref={name}
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-3 sm:p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>
              )}
              
              <motion.div variants={itemVariants}>
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: "#ef4444" }}
                  ref={email}
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 sm:p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: "#ef4444" }}
                  ref={password}
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 sm:p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                />
              </motion.div>
            </motion.div>

            {errorMassage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-300 text-sm text-center">{errorMassage}</p>
              </motion.div>
            )}

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 p-3 sm:p-4 btn-netflix text-white rounded-xl font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={handleButtonClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                />
              ) : null}
              {isLoading ? "Processing..." : (isSignInForm ? "Sign In" : "Sign Up")}
            </motion.button>
            
            <motion.div 
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <p className="text-gray-300 text-sm sm:text-base">
                {isSignInForm ? "New to Netflix? " : "Already have an account? "}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSignInForm}
                  className="text-red-400 hover:text-red-300 font-semibold hover:underline transition-colors"
                >
                  {isSignInForm ? "Sign up now" : "Sign in"}
                </motion.button>
              </p>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};
export default Login;