import type { FirebaseApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, type Auth } from "firebase/auth";
import { useAuthStore } from "./stores/auth";

let auth: Auth | null = null;

const initializeAuth = function (app: FirebaseApp) {
    auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
        const authStore = useAuthStore();
        if (user)
            authStore.user = user;
        else
            authStore.user = null;
    });
}

const anonSignIn = function () {
    return signInAnonymously(auth as Auth);
};

const register = function (email: string, password: string) {
    return createUserWithEmailAndPassword(auth as Auth, email, password);
};

const signIn = function (email: string, password: string) {
    return signInWithEmailAndPassword(auth as Auth, email, password);
};


export { initializeAuth, anonSignIn, register, signIn };