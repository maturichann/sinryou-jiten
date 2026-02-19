"use client";

import type { EntryLine } from "@/lib/billing/types";
import { SHINRYOU_ITEMS, CATEGORY_LABELS } from "@/lib/billing/master-data";
import { Button } from "@/components/ui/button";

interface Props {
  entries: EntryLine[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onAutoCalc: () => void;
}

function findItem(code: string) {
  return SHINRYOU_ITEMS.find((i) => i.code === code);
}

export function EntryList({ entries, onUpdateQuantity, onRemove, onClear, onAutoCalc }: Props) {
  const manualCount = entries.filter((e) => !e.isAutoAdded).length;
  const autoCount = entries.filter((e) => e.isAutoAdded).length;

  if (entries.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 py-2 border-b bg-slate-50">
          <Button
            onClick={onAutoCalc}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
          >
            自動算定
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 py-12 text-slate-400">
          <svg className="w-10 h-10 mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">左のパネルから診療行為を追加</p>
          <p className="text-xs mt-1">追加後に「自動算定」を押すと</p>
          <p className="text-xs">判断料・加算が自動で入ります</p>
        </div>
      </div>
    );
  }

  // カテゴリでグループ化
  const grouped = new Map<string, { item: ReturnType<typeof findItem>; entry: EntryLine }[]>();
  for (const entry of entries) {
    const item = findItem(entry.itemCode);
    if (!item) continue;
    const cat = item.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push({ item, entry });
  }

  return (
    <div className="flex flex-col h-full">
      {/* 自動算定ボタン + ヘッダ */}
      <div className="px-3 py-2 border-b bg-slate-50 space-y-2">
        <Button
          onClick={onAutoCalc}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
        >
          自動算定
        </Button>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            手動 {manualCount}件
            {autoCount > 0 && (
              <span className="ml-1 text-emerald-600">+ 自動 {autoCount}件</span>
            )}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-700 h-6 px-2"
          >
            全クリア
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {Array.from(grouped.entries()).map(([cat, items]) => {
          const catInfo = CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS];
          const catTotal = items.reduce((s, { item, entry }) => s + (item?.points ?? 0) * entry.quantity, 0);
          return (
            <div key={cat}>
              <div className="flex items-center justify-between px-3 py-1 bg-slate-50">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: catInfo?.color }}
                  />
                  <span className="text-[10px] font-semibold text-slate-500 tracking-wide">
                    {catInfo?.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {catTotal}点
                </span>
              </div>

              {items.map(({ item, entry }) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-2 px-3 py-2 group ${
                    entry.isAutoAdded ? "bg-emerald-50/50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {entry.isAutoAdded && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded font-medium shrink-0">
                          自動
                        </span>
                      )}
                      <span className="text-sm text-slate-800 truncate">
                        {item?.name}
                      </span>
                    </div>
                  </div>

                  {/* 数量 */}
                  <div className="flex items-center gap-1 shrink-0">
                    {(item?.unit || entry.quantity > 1) && (
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => onUpdateQuantity(entry.id, entry.quantity - 1)}
                          disabled={entry.quantity <= 1}
                          className="px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="px-1.5 text-xs font-mono min-w-[20px] text-center">
                          {entry.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(entry.id, entry.quantity + 1)}
                          className="px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-sm font-mono font-medium text-slate-700 w-14 text-right shrink-0">
                    {((item?.points ?? 0) * entry.quantity).toLocaleString()}点
                  </span>

                  <button
                    onClick={() => onRemove(entry.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors shrink-0"
                    title="削除"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
