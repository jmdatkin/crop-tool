import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged, signInWithCredential, type User } from "firebase/auth";
import { getUser, firebaseApp } from "@/firebase";

type UserState = {
    user: User | null;
};

const authUser = Object.keys(window.localStorage).filter((item) =>
    item.startsWith("firebase:authUser")
)[0];

export const useAuthStore = defineStore({
    id: "auth",
    state: (): UserState => ({
        user: null,
    }),
    actions: {
        init() {
            return new Promise<User | null>((resolve, reject) => {
                onAuthStateChanged(
                    getAuth(firebaseApp),
                    (user) => {
                        console.log(user);
                        this.user = user;
                        resolve(user);
                    },
                    reject
                );
            });
        },
    },
});
