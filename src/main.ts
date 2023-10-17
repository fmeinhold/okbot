import { createApp, ref } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'

const darkMode = ref(false)

const app = createApp(App).provide("darkMode", darkMode)

app.use(ElementPlus)

app.mount('#app')
