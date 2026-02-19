"use client";

import type { BillingSet, DictionaryItem } from "@/lib/dictionary/types";

interface Props {
  set: BillingSet;
  getItemByCode: (code: string) => DictionaryItem | undefined;
}

export function SetCard({ set, getItemByCode }: Props) {
  return (
    <div className="bg-white rounded-xl border border-amber-200 overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center gap-2">
          <span className="text-base">📦</span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-amber-900">{set.name}</div>
            <div className="text-xs text-amber-700 mt-0.5">
              {set.description}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-amber-50/30 border-t border-amber-100">
        <div className="text-[11px] text-amber-700 font-medium">
          🕐 {set.when}
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {set.items.map((code) => {
          const item = getItemByCode(code);
          if (!item) return (
            <div key={code} className="px-4 py-2 text-xs text-slate-400 font-mono">
              {code}
            </div>
          );
          return (
            <div key={code} className="px-4 py-2.5 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-sm text-slate-800 font-medium">
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {item.code}
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-blue-700 shrink-0">
                {item.points}
                <span className="text-[10px] font-normal text-slate-500 ml-0.5">点</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">合計</span>
          <span className="text-sm font-bold font-mono text-slate-800">
            {set.items.reduce((sum, code) => {
              const item = getItemByCode(code);
              return sum + (item?.points ?? 0);
            }, 0)}
            <span className="text-xs font-normal text-slate-500 ml-0.5">点</span>
          </span>
        </div>
      </div>
    </div>
  );
}
