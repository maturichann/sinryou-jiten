"use client";

import { useState, useMemo, useCallback } from "react";
import type { ShinryouCategory } from "@/lib/dictionary/types";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  DICTIONARY_ITEMS,
  BILLING_SETS,
} from "@/lib/dictionary/data";
import { DictionaryItemCard } from "@/components/dictionary/item-card";
import { SetCard } from "@/components/dictionary/set-card";

type TabMode = ShinryouCategory | "sets";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabMode>("shinsa");
  const [search, setSearch] = useState("");
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const toggleExpand = useCallback((code: string) => {
    setExpandedCode((prev) => (prev === code ? null : code));
  }, []);

  const filteredItems = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return DICTIONARY_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.whenToBill.some((w) => w.toLowerCase().includes(q)) ||
          item.cantBill?.some((c) => c.toLowerCase().includes(q)) ||
          item.tips?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeTab === "sets") return [];
    return DICTIONARY_ITEMS.filter((item) => item.category === activeTab);
  }, [activeTab, search]);

  const filteredSets = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return BILLING_SETS.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.when.toLowerCase().includes(q)
      );
    }
    return BILLING_SETS;
  }, [search]);

  const getItemByCode = useCallback((code: string) => {
    return DICTIONARY_ITEMS.find((item) => item.code === code);
  }, []);

  const isSearching = search.trim().length > 0;

  return (
    <div className="flex flex-col h-dvh bg-slate-50 overflow-hidden">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-baseline gap-2">
            <h1 className="text-lg font-bold tracking-wide">診療報酬辞典</h1>
            <span className="text-[11px] text-blue-200">
              令和6年度改定対応
            </span>
          </div>
          <p className="text-[11px] text-blue-200 mt-0.5">
            いつ算定できる？ いつダメ？ が一目でわかる
          </p>
        </div>

        {/* 検索バー */}
        <div className="px-4 pb-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="項目名・コード・キーワードで検索..."
              className="w-full rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* カテゴリタブ */}
      {!isSearching && (
        <div className="flex overflow-x-auto bg-white border-b shrink-0 scrollbar-hide">
          {CATEGORY_ORDER.map((cat) => {
            const info = CATEGORIES[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === cat
                    ? "border-blue-600 text-blue-700 bg-blue-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="mr-1">{info.icon}</span>
                {info.label}
              </button>
            );
          })}
          {/* セットタブ */}
          <button
            onClick={() => setActiveTab("sets")}
            className={`shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "sets"
                ? "border-amber-500 text-amber-700 bg-amber-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="mr-1">📦</span>
            よくあるセット
          </button>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isSearching ? (
          /* 検索結果 */
          <div className="p-3">
            <div className="text-xs text-slate-500 mb-2 px-1">
              {filteredItems.length + filteredSets.length}件の検索結果
            </div>

            {/* セット検索結果 */}
            {filteredSets.length > 0 && (
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-2 px-1">
                  セット
                </div>
                <div className="space-y-2">
                  {filteredSets.map((set) => (
                    <SetCard key={set.id} set={set} getItemByCode={getItemByCode} />
                  ))}
                </div>
              </div>
            )}

            {/* 項目検索結果 */}
            {filteredItems.length > 0 && (
              <div>
                {filteredSets.length > 0 && (
                  <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-2 px-1">
                    項目
                  </div>
                )}
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <DictionaryItemCard
                      key={item.code}
                      item={item}
                      expanded={expandedCode === item.code}
                      onToggle={() => toggleExpand(item.code)}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredItems.length === 0 && filteredSets.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">
                該当する項目がありません
              </div>
            )}
          </div>
        ) : activeTab === "sets" ? (
          /* セット一覧 */
          <div className="p-3 space-y-2">
            <div className="px-1 mb-3">
              <div className="text-sm font-semibold text-slate-700">
                よくあるセット
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                これとこれはセットで算定する、という頻出パターン集
              </div>
            </div>
            {BILLING_SETS.map((set) => (
              <SetCard key={set.id} set={set} getItemByCode={getItemByCode} />
            ))}
          </div>
        ) : (
          /* カテゴリ別項目一覧 */
          <div className="p-3">
            <div className="px-1 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{CATEGORIES[activeTab].icon}</span>
                <div>
                  <div className="text-sm font-semibold text-slate-700">
                    {CATEGORIES[activeTab].label}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {CATEGORIES[activeTab].code}
                  </div>
                </div>
                <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {filteredItems.length}件
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <DictionaryItemCard
                  key={item.code}
                  item={item}
                  expanded={expandedCode === item.code}
                  onToggle={() => toggleExpand(item.code)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
