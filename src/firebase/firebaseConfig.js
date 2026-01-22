import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOHQaAhpXqJK-BjjFnuijnJAD190OQtj8",
  authDomain: "wastecoin-378f4.firebaseapp.com",
  projectId: "wastecoin-378f4",
  storageBucket: "wastecoin-378f4.firebasestorage.app",
  messagingSenderId: "401798876032",
  appId: "1:401798876032:web:8965e6381db54eb207cf65"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
