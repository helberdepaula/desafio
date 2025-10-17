/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";


// Styles
import "unfonts.css";

import { createPinia } from "pinia";
import VuetifyMoney from "vuetify-money-3"

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia();

//presistindo no localStorage
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(pinia)
app.use(VuetifyMoney)

registerPlugins(app);

app.mount("#app");
