
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'primeicons/primeicons.css';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Checkbox from 'primevue/checkbox';
import ToastService from 'primevue/toastservice';


import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import Toast from "primevue/toast";


const vuetify = createVuetify();

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
});
app.use(ToastService);
app.component("Checkbox", Checkbox)
app.component("Toast", Toast)


app.mount('#app');
