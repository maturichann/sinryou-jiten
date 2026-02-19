"use client";

import { useState, useMemo } from "react";
import type { ShinryouCategory } from "@/lib/billing/types";
import { SHINRYOU_ITEMS, CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/billing/master-data";

interface Props {
  onAdd: (code: string, qty?: number) => void;
}

export function ShinryouPicker({ onAdd }: Props) {
  const [activeCategory, setActiveCategory] = useState<ShinryouCategory>("kensa");
  const [search, setSearch] = useState("");
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null);

  // shinsa(診察加算)はメインリストから除外し下部に固定表示
  const mainCategories = CATEGORY_ORDER.filter((c) => c !== "shinsa");

  const filteredItems = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return SHINRYOU_ITEMS.filter(
        (item) =>
          !item.hidden &&
          item.category !== "shinsa" &&
          (item.name.toLowerCase().includes(q) ||
           item.code.toLowerCase().includes(q) ||
           item.helpText?.toLowerCase().includes(q))
      );
    }
    return SHINRYOU_ITEMS.filter(
      (item) => !item.hidden && item.category === activeCategory
    );
  }, [activeCategory, search]);

  const shinsaAdditions = useMemo(
    () => SHINRYOU_ITEMS.filter((i) => i.category === "shinsa" && !i.hidden),
    []
  );

  return (
    <div className="flex flex-col h-full">
      {/* 検索バー */}
      <div className="px-3 py-2 border-b bg-white sticky top-0 z-10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="項目名・コード・キーワードで検索..."
          className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* カテゴリタブ */}
      {!search && (
        <div className="flex overflow-x-auto border-b bg-slate-50 scrollbar-hide">
          {mainCategories.map((cat) => {
            const info = CATEGORY_LABELS[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                  activeCategory === cat
                    ? "border-blue-600 text-blue-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                {info.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 項目リスト */}
      <div className="flex-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400">
            該当する項目がありません
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <div key={item.code} className="group">
                <button
                  onClick={() => onAdd(item.code, 1)}
                  className="w-full text-left px-3 py-2.5 hover:bg-blue-50 active:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="text-sm font-medium text-slate-800">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.code}
                        </span>
                        {item.unit && (
                          <span className="text-[10px] text-amber-600 bg-amber-50 px-1 rounded">
                            {item.unit}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-sm font-mono font-semibold text-slate-700">
                        {item.points > 0 ? `${item.points}点` : "入力"}
                      </span>
                    </div>
                  </div>
                </button>
                {/* helpText (?) ボタン */}
                {item.helpText && (
                  <div className="px-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedHelp(expandedHelp === item.code ? null : item.code);
                      }}
                      className="text-[11px] text-blue-500 hover:text-blue-700 mb-1"
                    >
                      {expandedHelp === item.code ? "▼ 説明を閉じる" : "▶ いつ算定する？"}
                    </button>
                    {expandedHelp === item.code && (
                      <div className="text-xs text-slate-600 bg-blue-50 rounded-md p-2.5 mb-2 leading-relaxed">
                        {item.helpText}
                        {item.warnings?.map((w, i) => (
                          <div key={i} className="mt-1.5 text-amber-700 font-medium">
                            ⚠ {w}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 診察加算セクション(常に下部に表示) */}
        {!search && (
          <div className="border-t-2 border-slate-200 mt-2">
            <div className="px-3 py-1.5 bg-slate-50 text-xs font-semibold text-slate-500 tracking-wide">
              診察加算
            </div>
            <div className="divide-y divide-slate-100">
              {shinsaAdditions.map((item) => (
                <div key={item.code}>
                  <button
                    onClick={() => onAdd(item.code, 1)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 active:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-slate-700">{item.name}</div>
                      </div>
                      <span className="text-sm font-mono font-medium text-slate-600 shrink-0 ml-2">
                        {item.points}点
                      </span>
                    </div>
                  </button>
                  {item.helpText && (
                    <div className="px-3">
                      <button
                        onClick={() => setExpandedHelp(expandedHelp === item.code ? null : item.code)}
                        className="text-[11px] text-blue-500 hover:text-blue-700 mb-1"
                      >
                        {expandedHelp === item.code ? "▼ 閉じる" : "▶ いつ算定する？"}
                      </button>
                      {expandedHelp === item.code && (
                        <div className="text-xs text-slate-600 bg-blue-50 rounded-md p-2.5 mb-2 leading-relaxed">
                          {item.helpText}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
