import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import resources from "./translations.json";

i18n.use(initReactI18next).init({
  resources,
  lng: navigator.language.split("-")[0] == "pt" ? "pt-BR" : "en-US",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
