// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import  { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXhFocQEUO1SQqlqZUfS6fG_iEBRDImNU",
  authDomain: "ai-travel-planner-50afa.firebaseapp.com",
  projectId: "ai-travel-planner-50afa",
  storageBucket: "ai-travel-planner-50afa.firebasestorage.app",
  messagingSenderId: "685493767197",
  appId: "1:685493767197:web:6e0776a46d8b0e0f3fcaf4",
  measurementId: "G-T5KBYPVJK3"
};



// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);
// const analytics = getAnalytics(app);