import { ar, enUS, type Locale } from "date-fns/locale";
import i18n from "../i18n";

type LangType = {
  lang: string;
  name: string;
  dateLocale: Locale;
  isDefault?: boolean;
};

export const supportedLanguages: LangType[] = [
  { lang: "en", name: "English", dateLocale: enUS, isDefault: true },
  { lang: "ar", name: "العربية", dateLocale: ar },
];

export const getDefaultLang = () =>
  supportedLanguages.find((mapLang) => mapLang.isDefault) ?? {
    lang: "en",
    name: "English",
    dateLocale: enUS,
  };

export const getCurrentLang = () =>
  supportedLanguages.find((mapLang) => mapLang.lang === i18n.language) ??
  getDefaultLang();

export const RTL_LANGS = new Set(["ar", "he", "fa", "ur"]);

export function getDir(lang: string): "ltr" | "rtl" {
  return RTL_LANGS.has(lang) ? "rtl" : "ltr";
}

export function isRTL(): boolean {
  const { language } = i18n;
  return getDir(language) === "rtl";
}

export function getDateLocale(): Locale {
  const { language } = i18n;
  const currentLocale = supportedLanguages.find(
    (lang) => lang.lang === language,
  )?.dateLocale;
  if (!currentLocale) return enUS;
  return currentLocale;
}

const LANG_FLAG_MAP: Record<string, string> = {
  en: "us",
  ar: "qa",
};

export const getFlagClass = (lang: string): string =>
  `fi fi-${LANG_FLAG_MAP[lang] ?? "un"}`; // 'un' = fallback/unknown flag

export function stripLangPrefix(pathname?: string) {
  const langs = supportedLanguages.map((l) => l.lang).join("|");
  return (
    (pathname ?? window.location.pathname).replace(
      new RegExp(`^/(${langs})(?=/|$)`),
      "",
    ) || "/"
  );
}

export function getPathLang(pathname?: string) {
  const langs = supportedLanguages.map((l) => l.lang).join("|");
  return (pathname ?? window.location.pathname).match(
    new RegExp(`^/(${langs})(?=/|$)`),
  )?.[1];
}

export function getLocalePrefix(pathname?: string) {
  const langs = supportedLanguages.map((l) => l.lang).join("|");
  const match = (pathname ?? window.location.pathname).match(
    new RegExp(`^/(${langs})(?=/|$)`),
  );
  return match ? match[0] : "";
}
