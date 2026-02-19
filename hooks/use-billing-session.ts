"use client";

import { useState, useMemo, useCallback } from "react";
import type {
  BillingSession,
  BillingResult,
  ConsultationType,
  TimeCategory,
  ArrivalMethod,
  InsuranceType,
  CopayRatio,
  EntryLine,
  ValidationMessage,
} from "@/lib/billing/types";
import { calculate } from "@/lib/billing/calculator";
import { getBaseAutoEntries, getContextAutoEntries } from "@/lib/billing/auto-calc";

const today = () => new Date().toISOString().slice(0, 10);

const DEFAULT_SESSION: BillingSession = {
  patient: {
    insuranceType: "shakai",
    copayRatio: 0.3,
    age: 40,
  },
  consultation: {
    type: "follow_up",
    timeCategory: "regular",
    arrivalMethod: "regular",
    date: today(),
  },
  entries: [],
};

/** 手動エントリを保持しつつ、base auto entriesを再計算する */
function recalcBaseEntries(session: BillingSession): BillingSession {
  const manualEntries = session.entries.filter((e) => !e.isAutoAdded);
  const sessionWithManual = { ...session, entries: manualEntries };
  const autoEntries = getBaseAutoEntries(sessionWithManual);
  return { ...session, entries: [...manualEntries, ...autoEntries] };
}

export function useBillingSession() {
  const [session, setSession] = useState<BillingSession>(() => {
    const initial = { ...DEFAULT_SESSION, consultation: { ...DEFAULT_SESSION.consultation, date: today() } };
    return recalcBaseEntries(initial);
  });

  const [autoMessages, setAutoMessages] = useState<ValidationMessage[]>([]);

  const result: BillingResult = useMemo(() => {
    const r = calculate(session);
    return { ...r, messages: [...r.messages, ...autoMessages] };
  }, [session, autoMessages]);

  // ── 患者情報 ──
  const setInsuranceType = useCallback((v: InsuranceType) => {
    setSession((s) => ({
      ...s,
      patient: { ...s.patient, insuranceType: v },
    }));
  }, []);

  const setCopayRatio = useCallback((v: CopayRatio) => {
    setSession((s) => ({
      ...s,
      patient: { ...s.patient, copayRatio: v },
    }));
  }, []);

  const setAge = useCallback((v: number) => {
    setSession((s) => {
      const updated = { ...s, patient: { ...s.patient, age: v } };
      return recalcBaseEntries(updated);
    });
  }, []);

  // ── 診察情報 ──
  const setConsultationType = useCallback((v: ConsultationType) => {
    setSession((s) => {
      const updated = { ...s, consultation: { ...s.consultation, type: v } };
      return recalcBaseEntries(updated);
    });
    setAutoMessages([]);
  }, []);

  const setTimeCategory = useCallback((v: TimeCategory) => {
    setSession((s) => {
      const updated = { ...s, consultation: { ...s.consultation, timeCategory: v } };
      return recalcBaseEntries(updated);
    });
    setAutoMessages([]);
  }, []);

  const setArrivalMethod = useCallback((v: ArrivalMethod) => {
    setSession((s) => {
      const updated = { ...s, consultation: { ...s.consultation, arrivalMethod: v } };
      return recalcBaseEntries(updated);
    });
    setAutoMessages([]);
  }, []);

  // ── 診療行為エントリ ──
  const addEntry = useCallback((itemCode: string, quantity = 1) => {
    setSession((s) => {
      const existing = s.entries.find((e) => e.itemCode === itemCode && !e.isAutoAdded);
      if (existing) {
        return {
          ...s,
          entries: s.entries.map((e) =>
            e.id === existing.id
              ? { ...e, quantity: e.quantity + quantity }
              : e
          ),
        };
      }
      const entry: EntryLine = {
        id: `${itemCode}_${Date.now()}`,
        itemCode,
        quantity,
        subtotal: 0,
      };
      return { ...s, entries: [...s.entries, entry] };
    });
  }, []);

  const updateEntryQuantity = useCallback((id: string, qty: number) => {
    setSession((s) => ({
      ...s,
      entries: s.entries.map((e) =>
        e.id === id ? { ...e, quantity: Math.max(1, qty) } : e
      ),
    }));
  }, []);

  const removeEntry = useCallback((id: string) => {
    setSession((s) => ({
      ...s,
      entries: s.entries.filter((e) => e.id !== id),
    }));
  }, []);

  const clearEntries = useCallback(() => {
    setSession((s) => {
      const updated = { ...s, entries: [] as EntryLine[] };
      return recalcBaseEntries(updated);
    });
    setAutoMessages([]);
  }, []);

  // ── 自動算定ボタン ──
  const runAutoCalc = useCallback(() => {
    setSession((s) => {
      // 既存の自動追加分を削除してから再計算
      const manual = s.entries.filter((e) => !e.isAutoAdded);
      const sessionWithManual = { ...s, entries: manual };

      const base = getBaseAutoEntries(sessionWithManual);
      const combined = { ...sessionWithManual, entries: [...manual, ...base] };
      const { entries: contextEntries, messages } = getContextAutoEntries(combined);

      // 既に手動で追加済みのものは除外
      const newContextEntries = contextEntries.filter(
        (ce) => !manual.some((me) => me.itemCode === ce.itemCode)
      );

      setAutoMessages(messages);

      return {
        ...s,
        entries: [...manual, ...base, ...newContextEntries],
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    const initial = { ...DEFAULT_SESSION, consultation: { ...DEFAULT_SESSION.consultation, date: today() } };
    setSession(recalcBaseEntries(initial));
    setAutoMessages([]);
  }, []);

  return {
    session,
    result,
    setInsuranceType,
    setCopayRatio,
    setAge,
    setConsultationType,
    setTimeCategory,
    setArrivalMethod,
    addEntry,
    updateEntryQuantity,
    removeEntry,
    clearEntries,
    runAutoCalc,
    resetAll,
  };
}
