import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createI18n, useI18n } from "vue-i18n";
import en from "./locales/en.json";
import sw from "./locales/sw.json";

const locale = localStorage.getItem("locale") || "sw";

export const i18n = createI18n({
  locale: locale,
  messages: { en, sw },
  legacy: false,
  fallbackWarn: false,
  missingWarn: false,
  globalInjection: true,
});

export const changeLocale = (lang) => {
  i18n.global.locale.value = lang;
  localStorage.setItem("locale", lang);
};

const app = createApp(App);

app.use(router);

app.use(i18n);

app.mount("#app");
