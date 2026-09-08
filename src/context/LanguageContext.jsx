import { createContext, useContext, useState } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }){
  const [lang, setLang] = useState("en");
  const t = (key) => translations[lang][key] || translations["en"][key] || key;
  const cycleLang = () => setLang(prev => prev==="en" ? "hi" : prev==="hi" ? "gu" : "en");
  return (
    <LanguageContext.Provider value={{ lang, setLang, cycleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
export function useLanguage(){ return useContext(LanguageContext); }
