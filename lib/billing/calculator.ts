import type {
  BillingSession,
  BillingResult,
  CategorySubtotal,
  ValidationMessage,
  ShinryouCategory,
} from "./types";
import {
  SHINRYOU_ITEMS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  POINT_TO_YEN,
} from "./master-data";

function findItem(code: string) {
  return SHINRYOU_ITEMS.find((i) => i.code === code);
}

export function calculate(session: BillingSession): BillingResult {
  const messages: ValidationMessage[] = [];
  const categoryMap = new Map<ShinryouCategory, CategorySubtotal>();

  for (const cat of CATEGORY_ORDER) {
    categoryMap.set(cat, {
      category: cat,
      label: CATEGORY_LABELS[cat].label,
      points: 0,
      items: [],
    });
  }

  // 処置・検査等の実施判定
  const hasConflictCategory = session.entries.some((entry) => {
    const item = findItem(entry.itemCode);
    return item && ["shochi", "kensa", "gazou", "chusha", "shujutsu", "sonota"].includes(item.category);
  });

  // 各入力行を集計
  for (const entry of session.entries) {
    const item = findItem(entry.itemCode);
    if (!item) continue;

    // ルールチェック
    if (item.requiresFollowUp && session.consultation.type === "initial") {
      messages.push({
        level: "error",
        message: `${item.name}は再診時のみ算定可能です`,
        relatedCodes: [item.code],
      });
      continue;
    }
    if (item.requiresInitial && session.consultation.type === "follow_up") {
      messages.push({
        level: "error",
        message: `${item.name}は初診時のみ算定可能です`,
        relatedCodes: [item.code],
      });
      continue;
    }

    // 外来管理加算の併算定チェック
    if (item.code === "A001-ADD" && hasConflictCategory) {
      messages.push({
        level: "error",
        message: "外来管理加算: 処置・検査・注射・手術・画像診断・リハビリ等を実施した場合は算定できません",
        relatedCodes: [item.code],
      });
      continue;
    }

    const sub = categoryMap.get(item.category)!;
    const linePoints = item.points * entry.quantity;
    sub.items.push({
      name: item.name,
      points: linePoints,
      quantity: entry.quantity,
    });
    sub.points += linePoints;
  }

  const categorySubtotals = CATEGORY_ORDER
    .map((cat) => categoryMap.get(cat)!)
    .filter((sub) => sub.items.length > 0);

  const totalPoints = categorySubtotals.reduce((s, c) => s + c.points, 0);
  const totalYen = totalPoints * POINT_TO_YEN;

  const ratio = session.patient.copayRatio;
  const patientCharge =
    ratio === 1.0
      ? totalYen
      : Math.round((totalYen * ratio) / 10) * 10;
  const insuranceClaim = totalYen - patientCharge;

  return {
    categorySubtotals,
    totalPoints,
    totalYen,
    patientCharge,
    insuranceClaim,
    messages,
  };
}
