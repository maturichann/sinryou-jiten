"use client";

import type { BillingResult } from "@/lib/billing/types";

interface Props {
  result: BillingResult;
}

const LEVEL_STYLE = {
  error: "text-red-600",
  warning: "text-amber-600",
  info: "text-blue-600",
  tip: "text-emerald-700",
};

const LEVEL_ICON = {
  error: "\u26D4",
  warning: "\u26A0\uFE0F",
  info: "\u2139\uFE0F",
  tip: "\uD83D\uDCA1",
};

export function ResultFooter({ result }: Props) {
  const visibleMessages = result.messages.filter((m) => m.level !== "info" || m.message.includes("追加しました"));

  return (
    <div className="border-t bg-white">
      {/* メッセージ */}
      {visibleMessages.length > 0 && (
        <div className="px-3 py-1.5 space-y-1 border-b bg-slate-50 max-h-32 overflow-y-auto">
          {visibleMessages.map((msg, i) => (
            <div
              key={i}
              className={`text-xs flex items-start gap-1.5 ${LEVEL_STYLE[msg.level]}`}
            >
              <span className="shrink-0 mt-px">{LEVEL_ICON[msg.level]}</span>
              <span>{msg.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* 点数サマリ */}
      <div className="px-3 py-2">
        <div className="flex items-end justify-between">
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {result.categorySubtotals.map((sub) => (
              <span key={sub.category} className="text-[11px] text-slate-500">
                {sub.label}
                <span className="font-mono ml-0.5 text-slate-700">{sub.points.toLocaleString()}</span>
              </span>
            ))}
          </div>
          <div className="text-right shrink-0 ml-4">
            <div className="text-xs text-slate-500">
              合計 <span className="font-mono font-bold text-lg text-slate-900">{result.totalPoints.toLocaleString()}</span> 点
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-dashed border-slate-200">
          <div className="flex gap-3 text-xs text-slate-500">
            <span>
              医療費総額
              <span className="font-mono ml-0.5">&yen;{result.totalYen.toLocaleString()}</span>
            </span>
            <span>
              保険請求
              <span className="font-mono ml-0.5">&yen;{result.insuranceClaim.toLocaleString()}</span>
            </span>
          </div>
          <div className="text-right text-slate-900">
            <span className="text-xs text-slate-500 mr-1">患者負担</span>
            <span className="font-mono font-bold text-xl">
              &yen;{result.patientCharge.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
