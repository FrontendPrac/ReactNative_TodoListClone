import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfXXqk37dxisiA_IqlxDchrz05aN1GZxo",
  authDomain: "rn-todoclone.firebaseapp.com",
  projectId: "rn-todoclone",
  storageBucket: "rn-todoclone.appspot.com",
  messagingSenderId: "755445681783",
  appId: "1:755445681783:web:bb170599d14522b5854072",
};

export const app = initializeApp(firebaseConfig);
export const dbService = getFirestore(app);
