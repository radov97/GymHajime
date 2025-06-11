import { defaultLocale } from "./i18n.js";

export default function getRequestConfig() {
  return {
    locale: defaultLocale,
  };
}
