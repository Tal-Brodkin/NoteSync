// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw5Qp15NGL73k4xZfAl0BOohnzoCOHIIE",
  authDomain: "notes-sharing-7939b.firebaseapp.com",
  projectId: "notes-sharing-7939b",
  storageBucket: "notes-sharing-7939b.appspot.com",
  messagingSenderId: "493711256272",
  appId: "1:493711256272:web:091732ee8160be93a2ccd5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;