import "./assets/main.css";
// import devtools from "@vue/devtools";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);

app.mount(".main");
