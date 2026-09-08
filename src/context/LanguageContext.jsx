import { createContext, useContext } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext();

// English-only: lang is fixed to "en". The t() API is kept so every
// consumer keeps working unchanged.
export function LanguageProvider({ children }){
  const lang = "en";
  const t = (key) => translations[lang][key] || key;
  const setLang = () => {};
  const cycleLang = () => {};
  return (
    <LanguageContext.Provider value={{ lang, setLang, cycleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
export function useLanguage(){ return useContext(LanguageContext); }
