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
    <div>
      <Header />
      <div className="absolute">
        <img className="h-screen object-cover md:h-full" src={BG_URL} alt="logo" />
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className=" w-full md:w-3/12 absolute p-12 bg-black my-36 mx-auto right-0 left-0 text-white bg-opacity-80"
      >
        <h1 className="md:font-bold text-2lg md:text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>
        {!isSignInForm && (
          <input
            ref={name}
            type="text"
            placeholder="Full Name"
            className="p-4 my-3 w-full bg-gray-600"
          />
        )}
        <input
          ref={email}
          type="text"
          placeholder="Email Address"
          className="p-4 my-3 w-full bg-gray-600"
        />

        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-4 my-2 w-full  bg-gray-600"
        />

        <p className="text-red-500 font-bold text-lg py-2">{errorMassage}</p>

        <button
          className="p-4 my-6 bg-red-700 w-full rounded-lg cursor-pointer"
          onClick={handleButtonClick}
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <p className="py-4 cursor-pointer" onClick={toggleSignInForm}>
          {isSignInForm
            ? " New to Netflix? Sign Up Now."
            : "Already registered? Sign In Now."}
        </p>
      </form>
    </div>
  );
};
export default Login;
