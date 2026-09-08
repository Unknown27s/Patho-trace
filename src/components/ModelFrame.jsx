import { MODEL_URL } from "../config";

export default function ModelFrame({ height = 520 }) {
  return (
    <div className="space-y-2">
      <div className="rounded-xl overflow-hidden border-2 border-emerald-200 bg-white shadow-inner" style={{ height }}>
        <iframe src={MODEL_URL} title="PathoTracer Mastitis ML Model" className="w-full h-full border-0" allow="camera; microphone; clipboard-read; clipboard-write" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs px-1">
        <span className="text-slate-500">
          Model: <a href={MODEL_URL} target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold">{MODEL_URL.replace('https://','')}</a>
        </span>
        <a href={MODEL_URL} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">open_in_new</span> Open fullscreen
        </a>
      </div>
    </div>
  );
}
