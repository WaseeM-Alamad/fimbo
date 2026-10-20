import { useLayoutEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import i18n from "../i18n";
import NotFound from "./NotFound/NotFound";
import {
  getDefaultLang,
  getDir,
  stripLangPrefix,
  supportedLanguages,
} from "../utils/supportedLanguages";

const langs = supportedLanguages.map((item) => item.lang);

export default function LanguageProvider() {
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (lang && !langs.includes(lang)) return;

    const language =
      lang && langs.includes(lang) ? lang : getDefaultLang().lang;

    if (!lang) {
      const savedLanguage = localStorage.getItem("language");
      if (
        savedLanguage &&
        langs.includes(savedLanguage) &&
        savedLanguage !== getDefaultLang().lang
      ) {
        const pathWithoutLangPrefix = stripLangPrefix(location.pathname);
        navigate(`/${savedLanguage}${pathWithoutLangPrefix}`, {
          replace: true,
        });
        return;
      }
    }

    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    localStorage.setItem("language", language);
    document.documentElement.dir = getDir(language);
    document.documentElement.lang = language;
  }, [lang, location.pathname, navigate]);

  useLayoutEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "language" || !e.newValue) return;

      const newLang = e.newValue;
      const currentLang = lang ?? getDefaultLang().lang;

      if (newLang === currentLang) return;

      const pathWithoutLangPrefix = stripLangPrefix(location.pathname);
      window.location.replace(`/${newLang}${pathWithoutLangPrefix}`);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [lang, location.pathname]);

  if (lang && !langs.includes(lang)) {
    return <NotFound />;
  }

  return <Outlet />;
}
