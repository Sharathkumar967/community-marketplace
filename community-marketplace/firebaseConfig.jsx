import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyClm9NlCpjAe9dCm12l5N_JUJvaHnGrD9g",
  authDomain: "community-marketplace-a2118.firebaseapp.com",
  projectId: "community-marketplace-a2118",
  storageBucket: "community-marketplace-a2118.appspot.com",
  messagingSenderId: "451729989369",
  appId: "1:451729989369:web:8d77abf6978beee7608c28",
  measurementId: "G-R6KCL2ZYZL",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
