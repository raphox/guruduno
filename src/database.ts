import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAcefwyPAXMk1qzdecejhkph1WOC9YoVPk",
  authDomain: "guruduno-4695e.firebaseapp.com",
  projectId: "guruduno-4695e",
  storageBucket: "guruduno-4695e.appspot.com",
  messagingSenderId: "636176893231",
  appId: "1:636176893231:web:d7af565d154a57658c8dda",
  measurementId: "G-X07DXLGFVZ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db;
