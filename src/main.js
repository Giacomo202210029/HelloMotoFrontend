import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'primeicons/primeicons.css';


createApp(App).mount('#app');

createApp(App)
    .use(router) // Registra el router en la aplicación
    .mount('#app');
