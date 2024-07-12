// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUcgQ7F3yyLGVtcAntIQElQTtxabv8NWE",
  authDomain: "netflixgpt-db200.firebaseapp.com",
  projectId: "netflixgpt-db200",
  storageBucket: "netflixgpt-db200.appspot.com",
  messagingSenderId: "137196865188",
  appId: "1:137196865188:web:35654529df5f83b4cf0831",
  measurementId: "G-5P5833EFF2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 
 export const auth = getAuth();