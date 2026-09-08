import { useLanguage } from "../context/LanguageContext";
import { langLabels } from "../i18n/translations";

export default function LanguageSwitcher({ compact=false }){
  const { lang, setLang, cycleLang } = useLanguage();
  if(compact){
    return (
      <button onClick={cycleLang} className="h-9 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border text-emerald-700 text-xs font-bold flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[16px]">translate</span>
        <span>{langLabels[lang]}</span>
        <span className="text-slate-400 text-[10px]">/ {lang==="en" ? "हि" : lang==="hi" ? "ગુ" : "EN"}</span>
      </button>
    )
  }
  return (
    <div className="flex rounded-full bg-slate-100 border p-1 gap-1">
      {["en","hi","gu"].map(l=>(
        <button key={l} onClick={()=>setLang(l)} className={`px-3 py-1 rounded-full text-xs font-bold ${lang===l ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-white"}`}>{langLabels[l]}</button>
      ))}
    </div>
  )
}
