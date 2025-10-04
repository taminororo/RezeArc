"use client";

import { useState } from "react";

export default function Accordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-xl border border-orange-50 rounded">
      {/* タイトルバー */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center gap-2 px-4 py-3 text-lg font-medium
          ${open ? "bg-orange-50" : "bg-orange-50"} 
          hover:bg-orange-50 transition-colors`}
      >
        <span className="text-black">
            <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
            ▼
            </span>
            <span>講義棟 3F</span>
        </span>
      </button>

      {/* コンテンツ部分 */}
      {open && (
        <div className="p-4 bg-amber-200">
          <img src="/vercel.svg" alt="sample" className="w-40 h-auto" />
        </div>
      )}
    </div>
  );
}
