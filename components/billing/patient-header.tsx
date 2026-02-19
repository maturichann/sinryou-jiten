"use client";

import type { ConsultationType, TimeCategory, ArrivalMethod, InsuranceType, CopayRatio } from "@/lib/billing/types";
import {
  CONSULTATION_TYPE_LABELS,
  TIME_CATEGORY_LABELS,
  INSURANCE_TYPE_LABELS,
  ARRIVAL_METHOD_LABELS,
} from "@/lib/billing/master-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  consultationType: ConsultationType;
  timeCategory: TimeCategory;
  arrivalMethod: ArrivalMethod;
  insuranceType: InsuranceType;
  copayRatio: CopayRatio;
  age: number;
  onConsultationTypeChange: (v: ConsultationType) => void;
  onTimeCategoryChange: (v: TimeCategory) => void;
  onArrivalMethodChange: (v: ArrivalMethod) => void;
  onInsuranceTypeChange: (v: InsuranceType) => void;
  onCopayRatioChange: (v: CopayRatio) => void;
  onAgeChange: (v: number) => void;
}

export function PatientHeader({
  consultationType,
  timeCategory,
  arrivalMethod,
  insuranceType,
  copayRatio,
  age,
  onConsultationTypeChange,
  onTimeCategoryChange,
  onArrivalMethodChange,
  onInsuranceTypeChange,
  onCopayRatioChange,
  onAgeChange,
}: Props) {
  return (
    <div className="bg-slate-900 text-white">
      {/* 病院名 */}
      <div className="px-3 pt-2 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-wide">敦賀病院</span>
          <span className="text-[10px] text-slate-400">会計チェッカー</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>年齢</span>
          <input
            type="number"
            value={age}
            onChange={(e) => onAgeChange(Math.max(0, Math.min(120, Number(e.target.value))))}
            className="w-12 bg-slate-800 border border-slate-600 rounded px-1.5 py-0.5 text-white text-center text-xs"
            min={0}
            max={120}
          />
          <span>歳</span>
        </div>
      </div>

      {/* 操作ボタン群 */}
      <div className="px-3 pb-2 flex flex-wrap items-center gap-2">
        {/* 初診/再診 */}
        <div className="flex rounded-md overflow-hidden border border-slate-600">
          {(Object.entries(CONSULTATION_TYPE_LABELS) as [ConsultationType, string][]).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => onConsultationTypeChange(key)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  consultationType === key
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* 時間帯 */}
        <Select value={timeCategory} onValueChange={(v) => onTimeCategoryChange(v as TimeCategory)}>
          <SelectTrigger className="w-[130px] h-8 bg-slate-800 border-slate-600 text-white text-sm [&>svg]:text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(TIME_CATEGORY_LABELS) as [TimeCategory, string][]).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 来院方法 */}
        <div className="flex rounded-md overflow-hidden border border-slate-600">
          {(Object.entries(ARRIVAL_METHOD_LABELS) as [ArrivalMethod, string][]).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => onArrivalMethodChange(key)}
                className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  arrivalMethod === key
                    ? "bg-orange-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        <div className="border-l border-slate-600 h-6 mx-0.5" />

        {/* 保険種別 */}
        <Select value={insuranceType} onValueChange={(v) => onInsuranceTypeChange(v as InsuranceType)}>
          <SelectTrigger className="w-[100px] h-8 bg-slate-800 border-slate-600 text-white text-sm [&>svg]:text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(INSURANCE_TYPE_LABELS) as [InsuranceType, string][]).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 負担割合 */}
        <div className="flex rounded-md overflow-hidden border border-slate-600">
          {([
            { v: 0.1 as CopayRatio, l: "1割" },
            { v: 0.2 as CopayRatio, l: "2割" },
            { v: 0.3 as CopayRatio, l: "3割" },
          ]).map(({ v, l }) => (
            <button
              key={v}
              onClick={() => onCopayRatioChange(v)}
              className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                copayRatio === v
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
