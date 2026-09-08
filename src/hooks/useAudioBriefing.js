import { useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

export function useAudioBriefing(){
  const { lang, t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const utterRef = useRef(null);

  const toggle = () => {
    if(playing){
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const text = t("briefingText");
    const utter = new SpeechSynthesisUtterance(text);
    // map lang to voice lang code
    const map = { en: "en-IN", hi: "hi-IN", gu: "gu-IN", ta: "ta-IN", te: "te-IN", kn: "kn-IN", mr: "mr-IN" };
    utter.lang = map[lang] || "en-IN";
    utter.rate = 0.95;
    utter.onend = () => setPlaying(false);
    utter.onerror = () => setPlaying(false);
    utterRef.current = utter;
    setPlaying(true);
    window.speechSynthesis.speak(utter);
  };

  const stop = () => { window.speechSynthesis.cancel(); setPlaying(false); };

  return { playing, toggle, stop };
}
