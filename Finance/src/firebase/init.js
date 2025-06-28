import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDh2pj4OHtPSHSlYAp7Bk6QPEQXMmPaaGs",
  authDomain: "finance-8d882.firebaseapp.com",
  projectId: "finance-8d882",
  storageBucket: "finance-8d882.appspot.com",
  messagingSenderId: "1028891785117",
  appId: "1:1028891785117:web:8c90c167efd98dd9082174",
  measurementId: "G-9QWYFNRTXK"
};

console.log("FIREBASE CONFIG IN USE:", JSON.stringify(firebaseConfig, null, 2));

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage }; 