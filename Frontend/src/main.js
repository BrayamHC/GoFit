import './assets/main.css'
import './assets/styles/master.css'  

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify (desde plugin centralizado)
import vuetify from './plugins/vuetify'

// PrimeVue (temporal, remover cuando migres al 100% Vuetify)
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

// Temporal PrimeVue
app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
