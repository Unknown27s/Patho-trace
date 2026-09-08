import { useEffect } from "react";
export default function Toast({ msg, onClose }){
  useEffect(()=>{ const id=setTimeout(onClose,2500); return ()=>clearTimeout(id); },[onClose]);
  if(!msg) return null;
  return <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg z-50">{msg}</div>
}
