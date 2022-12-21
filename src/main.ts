import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload, faCrop, faMoon, faSun, faLockOpen, faLock } from '@fortawesome/free-solid-svg-icons'
import { faSquareFull } from '@fortawesome/free-regular-svg-icons';

import App from './App.vue'
import router from './router'
import './index.css';
import { useAuthStore } from './stores/auth';

(async () => {
    const app = createApp(App)

app.use(createPinia())
app.use(router)

const { signInFromLocalStorage } = useAuthStore();

await signInFromLocalStorage();

library.add(faUpload, faCrop, faMoon, faSun, faLockOpen, faLock, faSquareFull);

app.mount('#app')
})()
