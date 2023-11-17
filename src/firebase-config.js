import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries  

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEubAaOCBIUqT6AKtdsiRG7mpASHHH0dc",
  authDomain: "project-8073e.firebaseapp.com",
  projectId: "project-8073e",
  storageBucket: "project-8073e.appspot.com",
  messagingSenderId: "1052280614200",
  appId: "1:1052280614200:web:cb2789a2d6fe28e0f0e5cd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app); 

