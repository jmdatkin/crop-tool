import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload, faCrop, faMoon, faSun, faM } from '@fortawesome/free-solid-svg-icons'

import App from './App.vue'
import router from './router'
import './index.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)

library.add(faUpload, faCrop, faMoon, faSun);

app.mount('#app')
