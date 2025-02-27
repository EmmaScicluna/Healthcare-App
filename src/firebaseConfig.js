// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4_Q0mMhsmrWBtICYooUH3Rztk9Nw9Zrw",
  authDomain: "healthcare-app-a1839.firebaseapp.com",
  projectId: "healthcare-app-a1839",
  storageBucket: "healthcare-app-a1839.firebasestorage.app",
  messagingSenderId: "317068268307",
  appId: "1:317068268307:web:50b1fac1fc130cc9ae00e6",
  measurementId: "G-8JGKCW0J8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);