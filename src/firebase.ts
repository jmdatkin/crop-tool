// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, browserSessionPersistence, getAuth, initializeAuth, setPersistence } from "firebase/auth";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, type Auth } from "firebase/auth";
import { useAuthStore } from "./stores/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD48ZZkpWEbR4PHBN7slsXlJNGNF-hnBCQ",
    authDomain: "croppy-tool.firebaseapp.com",
    projectId: "croppy-tool",
    storageBucket: "croppy-tool.appspot.com",
    messagingSenderId: "437494903213",
    appId: "1:437494903213:web:1c5119d6fee84a5d213124",
    measurementId: "G-16097Z4N9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);
setPersistence(auth, browserLocalPersistence)

// .then(() => onAuthStateChanged(auth, console.log));
// const analytics = getAnalytics(app);

const anonSignIn = function () {
    return signInAnonymously(auth as Auth);
};

const register = function (email: string, password: string) {
    return createUserWithEmailAndPassword(auth as Auth, email, password);
};
0
const signIn = function (email: string, password: string) {
    return signInWithEmailAndPassword(auth as Auth, email, password);
};

const getUser = function(uid: string) {
    return getAuth().getUser(uid);
};

export { app as firebaseApp, anonSignIn, register, signIn, getUser };