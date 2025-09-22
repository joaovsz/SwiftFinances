// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { Platform } from 'react-native';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvX8dSQMrz_j_is6d585Z98GGyh7Vdxhs",
  authDomain: "swiftfinances.firebaseapp.com",
  projectId: "swiftfinances",
  storageBucket: "swiftfinances.appspot.com",
  messagingSenderId: "1021567186213",
  appId: "1:1021567186213:web:305b02e62503b2c5a216cc",
  measurementId: "G-WMNRRKY965"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Auth with proper persistence for each platform
let auth: Auth;
if (Platform.OS === 'web') {
  // For web, use the default getAuth
  auth = getAuth(app);
} else {
  // For mobile, use initializeAuth with AsyncStorage persistence
  const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export { auth, db, app };