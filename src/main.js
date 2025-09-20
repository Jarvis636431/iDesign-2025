import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import router from "./router";
import zh from "./locales/zh.json";
import en from "./locales/en.json";

const resolveInitialLocale = () => {
  if (typeof window === "undefined") {
    return "zh";
  }

  const storedLocale = window.localStorage?.getItem("app-locale");
  if (storedLocale === "zh" || storedLocale === "en") {
    return storedLocale;
  }

  const browserLanguage = window.navigator.language || "zh";
  return browserLanguage.toLowerCase().startsWith("en") ? "en" : "zh";
};

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: resolveInitialLocale(),
  fallbackLocale: "zh",
  messages: {
    zh,
    en,
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.mount("#app");
