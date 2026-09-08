// Single unified brand mark — used identically on PC and mobile, farmer and doctor views.
// Fixes the "logo shows different in mobile view vs pc view" issue.
export default function Logo({ size = 40, dark = false, showText = true }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div
        className="rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-200 bg-white"
        style={{ width: size, height: size, padding: 5 }}
        aria-label="KsheeraAI logo"
      >
        {/* Inline SVG: milk drop + udder quarters (LF/RF/LR/RR) — no external URL, works offline */}
        <svg viewBox="0 0 48 48" className="w-full h-full" role="img" aria-hidden="true">
          <path d="M24 3C24 3 11 20 11 29a13 13 0 0 0 26 0C37 20 24 3 24 3Z" fill="#047857" />
          <path d="M24 8C24 8 15 20 15 28a9 9 0 0 0 18 0C33 20 24 8 24 8Z" fill="#fff" opacity="0.92" />
          <circle cx="19" cy="30" r="3.2" fill="#047857" />
          <circle cx="29" cy="30" r="3.2" fill="#047857" />
          <circle cx="19" cy="36.5" r="3.2" fill="#059669" />
          <circle cx="29" cy="36.5" r="3.2" fill="#059669" />
        </svg>
      </div>
      {showText && (
        <div className="min-w-0 leading-none">
          <div className={`font-jakarta font-extrabold truncate ${dark ? "text-white" : "text-emerald-800"}`} style={{ fontSize: size >= 40 ? 16 : 14 }}>
            KsheeraAI
          </div>
          <div className={`text-[10px] font-bold tracking-widest ${dark ? "text-emerald-300" : "text-emerald-600"}`}>
            DAIRY AI • SIH
          </div>
        </div>
      )}
    </div>
  );
}
