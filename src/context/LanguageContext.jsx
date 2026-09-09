import { createContext, useContext, useState } from "react";
import { translations, langOrder } from "../i18n/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }){
  const [lang, setLang] = useState("en");
  const t = (key) => (translations[lang] && translations[lang][key]) || translations["en"][key] || key;
  const cycleLang = () => setLang((prev) => {
    const i = langOrder.indexOf(prev);
    return langOrder[(i + 1) % langOrder.length];
  });
  return (
    <LanguageContext.Provider value={{ lang, setLang, cycleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
export function useLanguage(){ return useContext(LanguageContext); }
