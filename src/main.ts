import { createApp, ref } from 'vue'
import './main.css'

import App from './App.vue'

const darkMode = ref(false)

const app = createApp(App).provide("darkMode", darkMode)

app.mount('#app')
