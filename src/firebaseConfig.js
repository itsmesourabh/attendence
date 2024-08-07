// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDumcPDteiR3rYlYTJYPn93iSjKV7Kclw0",
  authDomain: "insta-demo-c3b85.firebaseapp.com",
  projectId: "insta-demo-c3b85",
  storageBucket: "insta-demo-c3b85.appspot.com",
  messagingSenderId: "104825956018",
  appId: "1:104825956018:web:e921e2499145ba0dec8bab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };