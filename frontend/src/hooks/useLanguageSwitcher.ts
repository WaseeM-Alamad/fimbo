import { useTranslation } from "react-i18next";
import {
  getDefaultLang,
  supportedLanguages,
} from "../utils/supportedLanguages";

export function useLanguageSwitcher() {
  const { i18n } = useTranslation();

  const langs = supportedLanguages.map((item) => item.lang);

  function changeLanguage(newLang: string) {
    if (!langs.includes(newLang.trim())) return;
    const path = window.location.pathname;
    const segments = path.split("/").filter(Boolean);

    if (langs.includes(segments[0])) {
      segments.shift();
    }

    if (newLang !== getDefaultLang().lang) {
      segments.unshift(newLang);
    }

    localStorage.setItem("language", newLang);
    window.location.replace(
      `/${segments.join("/")}${window.location.search}${window.location.hash}`,
    );
  }
  return {
    language: i18n.language,
    changeLanguage,
  };
}
