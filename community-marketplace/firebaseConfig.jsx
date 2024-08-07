// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClm9NlCpjAe9dCm12l5N_JUJvaHnGrD9g",
  authDomain: "community-marketplace-a2118.firebaseapp.com",
  projectId: "community-marketplace-a2118",
  storageBucket: "community-marketplace-a2118.appspot.com",
  messagingSenderId: "451729989369",
  appId: "1:451729989369:web:8d77abf6978beee7608c28",
  measurementId: "G-R6KCL2ZYZL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
