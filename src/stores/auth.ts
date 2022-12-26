import { defineStore } from 'pinia'
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getUser, firebaseApp } from '@/firebase';

type UserState = {
    user: User | null
};

const authUser = Object.keys(window.localStorage)
    .filter(item => item.startsWith('firebase:authUser'))[0]

export const useAuthStore = defineStore({
    id: 'auth',
    state: (): UserState => ({
        user: null
    }),
    actions: {
        signInFromLocalStorage() {
            console.log("Attempting to sign in from local storage");
            return new Promise<void>((resolve, reject) => {
                onAuthStateChanged(
                    getAuth(firebaseApp),
                    async (user) => {
                        console.log(user);
                        this.user = user;
                        resolve();
                    },
                    reject
                );
            });
        }
    }
});
