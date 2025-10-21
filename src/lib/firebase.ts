import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRfAEMsXaV5YYk351NAjOCz1T4F-qVXWk",
  authDomain: "controladoria-interna-cbmpa.firebaseapp.com",
  projectId: "controladoria-interna-cbmpa",
  storageBucket: "controladoria-interna-cbmpa.appspot.com",
  messagingSenderId: "375841615475",
  appId: "1:375841615475:web:a807dc7af8d5a3a57a8406",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
