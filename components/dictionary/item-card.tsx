"use client";

import type { DictionaryItem } from "@/lib/dictionary/types";
import { CATEGORIES } from "@/lib/dictionary/data";

interface Props {
  item: DictionaryItem;
  expanded: boolean;
  onToggle: () => void;
}

export function DictionaryItemCard({ item, expanded, onToggle }: Props) {
  const cat = CATEGORIES[item.category];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* 項目ヘッダー（タップで展開） */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-800">
                {item.name}
              </span>
              {item.unit && (
                <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md font-medium">
                  {item.unit}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono text-slate-400">
                {item.code}
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                style={{
                  backgroundColor: cat.color + "15",
                  color: cat.color,
                }}
              >
                {cat.icon} {cat.label}
              </span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-base font-bold font-mono text-blue-700">
              {item.points}
              <span className="text-xs font-normal text-slate-500 ml-0.5">
                点
              </span>
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* 概要（常に表示） */}
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          {item.description}
        </p>
      </button>

      {/* 展開時の詳細 */}
      {expanded && (
        <div className="border-t border-slate-100">
          {/* いつ算定する？ */}
          <div className="px-4 py-3 bg-emerald-50/50">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
                ✅
              </span>
              <span className="text-xs font-bold text-emerald-800">
                こんな時に算定
              </span>
            </div>
            <ul className="space-y-1.5">
              {item.whenToBill.map((w, i) => (
                <li key={i} className="text-xs text-emerald-900 leading-relaxed flex gap-2">
                  <span className="text-emerald-400 shrink-0 mt-0.5">●</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 算定できない場合 */}
          {item.cantBill && item.cantBill.length > 0 && (
            <div className="px-4 py-3 bg-red-50/50 border-t border-slate-100">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs">
                  ❌
                </span>
                <span className="text-xs font-bold text-red-800">
                  算定できない場合
                </span>
              </div>
              <ul className="space-y-1.5">
                {item.cantBill.map((c, i) => (
                  <li key={i} className="text-xs text-red-900 leading-relaxed flex gap-2">
                    <span className="text-red-400 shrink-0 mt-0.5">●</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ポイント・注意点 */}
          {item.tips && item.tips.length > 0 && (
            <div className="px-4 py-3 bg-amber-50/50 border-t border-slate-100">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs">
                  💡
                </span>
                <span className="text-xs font-bold text-amber-800">
                  ポイント・注意点
                </span>
              </div>
              <ul className="space-y-1.5">
                {item.tips.map((t, i) => (
                  <li key={i} className="text-xs text-amber-900 leading-relaxed">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* セットで算定 */}
          {item.setWith && item.setWith.length > 0 && (
            <div className="px-4 py-3 bg-blue-50/50 border-t border-slate-100">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                  🔗
                </span>
                <span className="text-xs font-bold text-blue-800">
                  セットで算定
                </span>
              </div>
              <ul className="space-y-1">
                {item.setWith.map((s, i) => (
                  <li key={i} className="text-xs text-blue-900 leading-relaxed">
                    → {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
