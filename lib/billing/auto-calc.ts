/**
 * 自動算定エンジン
 * 入力された診療行為に基づいて、付随する項目を自動追加する
 */

import type { BillingSession, EntryLine, ValidationMessage } from "./types";
import { SHINRYOU_ITEMS, TIME_SURCHARGE_CODES } from "./master-data";

function findItem(code: string) {
  return SHINRYOU_ITEMS.find((i) => i.code === code);
}

function hasEntry(entries: EntryLine[], code: string) {
  return entries.some((e) => e.itemCode === code);
}

function hasAnyTag(entries: EntryLine[], tag: string) {
  return entries.some((e) => {
    const item = findItem(e.itemCode);
    return item?.tags?.includes(tag);
  });
}

function makeAutoEntry(code: string): EntryLine | null {
  const item = findItem(code);
  if (!item) return null;
  return {
    id: `auto_${code}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    itemCode: code,
    quantity: 1,
    subtotal: item.points,
    isAutoAdded: true,
  };
}

const EMERGENCY_TIMES = ["off_hours", "off_hours_special", "holiday", "late_night"];

/**
 * 基本設定(初診/再診、時間帯、来院方法)に基づく必須項目を返す
 * 設定が変わるたびに再計算される
 */
export function getBaseAutoEntries(session: BillingSession): EntryLine[] {
  const result: EntryLine[] = [];
  const { consultation, patient } = session;

  // ── 初診料 or 再診料 ──
  const consultCode = consultation.type === "initial" ? "A000" : "A001";
  if (!hasEntry(session.entries, consultCode)) {
    const e = makeAutoEntry(consultCode);
    if (e) result.push(e);
  }

  // ── 時間帯加算 ──
  const surchargeCode = TIME_SURCHARGE_CODES[consultation.type][consultation.timeCategory];
  if (surchargeCode && !hasEntry(session.entries, surchargeCode)) {
    const e = makeAutoEntry(surchargeCode);
    if (e) result.push(e);
  }

  // ── 明細書発行体制等加算 (常に) ──
  if (!hasEntry(session.entries, "A003")) {
    const e = makeAutoEntry("A003");
    if (e) result.push(e);
  }

  // ── 乳幼児加算 (6歳未満) ──
  if (patient.age < 6) {
    if (consultation.type === "initial" && !hasEntry(session.entries, "A000-INF")) {
      const e = makeAutoEntry("A000-INF");
      if (e) result.push(e);
    }
    if (consultation.type === "follow_up" && !hasEntry(session.entries, "A001-INF")) {
      const e = makeAutoEntry("A001-INF");
      if (e) result.push(e);
    }
  }

  // ── 来院方法別の自動算定 ──
  const isEmergencyTime = EMERGENCY_TIMES.includes(consultation.timeCategory);

  // ウォークイン + 時間外 + 初診 → 院内トリアージ実施料
  if (
    consultation.arrivalMethod === "walk_in" &&
    isEmergencyTime &&
    consultation.type === "initial" &&
    !hasEntry(session.entries, "B001-2-5")
  ) {
    const e = makeAutoEntry("B001-2-5");
    if (e) result.push(e);
  }

  // 救急車 + 時間外 + 初診 → 夜間休日救急搬送医学管理料 + 救急搬送看護体制加算
  if (
    consultation.arrivalMethod === "ambulance" &&
    isEmergencyTime &&
    consultation.type === "initial"
  ) {
    if (!hasEntry(session.entries, "B001-2-6")) {
      const e = makeAutoEntry("B001-2-6");
      if (e) result.push(e);
    }
    if (!hasEntry(session.entries, "B001-2-6-2")) {
      const e = makeAutoEntry("B001-2-6-2");
      if (e) result.push(e);
    }
  }

  return result;
}

/**
 * 入力された診療行為に基づく自動算定項目を返す
 * 「自動算定」ボタン押下時に実行
 */
export function getContextAutoEntries(session: BillingSession): {
  entries: EntryLine[];
  messages: ValidationMessage[];
} {
  const result: EntryLine[] = [];
  const messages: ValidationMessage[] = [];
  const allEntries = session.entries;

  // ── 外来管理加算(再診 + 処置等なし) ──
  if (session.consultation.type === "follow_up") {
    const hasConflict = allEntries.some((e) => {
      const item = findItem(e.itemCode);
      return item && ["shochi", "kensa", "gazou", "chusha", "shujutsu", "sonota"].includes(item.category);
    });

    if (!hasConflict && !hasEntry(allEntries, "A001-ADD")) {
      const e = makeAutoEntry("A001-ADD");
      if (e) result.push(e);
      messages.push({
        level: "info",
        message: "処置・検査等なし → 外来管理加算(52点)を追加しました。処置・検査・注射等を追加する場合は削除してください。",
      });
    }

    // 外来管理加算が既にあるのに処置等がある場合のエラー
    if (hasEntry(allEntries, "A001-ADD") && hasConflict) {
      messages.push({
        level: "error",
        message: "外来管理加算は処置・検査・注射・手術・画像診断・リハビリ等を実施した場合は算定不可です。削除してください。",
      });
    }
  }

  // ── 検査関連の自動算定 ──

  const hasBloodTest = hasAnyTag(allEntries, "blood");
  const hasBiochem = hasAnyTag(allEntries, "biochem");
  const hasHematology = hasAnyTag(allEntries, "hematology");
  const hasImmunology = hasAnyTag(allEntries, "immunology");
  const hasUrine = hasAnyTag(allEntries, "urine");

  // 採血料(血液検査があれば)
  if (hasBloodTest && !hasEntry(allEntries, "D-SAIK")) {
    const e = makeAutoEntry("D-SAIK");
    if (e) result.push(e);
  }

  // 検体検査判断料(該当するカテゴリの検査があれば)
  if (hasBiochem && !hasEntry(allEntries, "D-PHAN")) {
    const e = makeAutoEntry("D-PHAN");
    if (e) result.push(e);
  }
  if (hasHematology && !hasEntry(allEntries, "D-PHKE")) {
    const e = makeAutoEntry("D-PHKE");
    if (e) result.push(e);
  }
  if (hasImmunology && !hasEntry(allEntries, "D-PHBI")) {
    const e = makeAutoEntry("D-PHBI");
    if (e) result.push(e);
  }
  if (hasUrine && !hasEntry(allEntries, "D-PHNI")) {
    const e = makeAutoEntry("D-PHNI");
    if (e) result.push(e);
  }

  // ── 画像診断関連の自動算定 ──

  const hasXray = hasAnyTag(allEntries, "xray");
  const hasCT = hasAnyTag(allEntries, "ct");
  const hasMRI = hasAnyTag(allEntries, "mri");
  const isEmergencyTime = EMERGENCY_TIMES.includes(session.consultation.timeCategory);

  // レントゲン → 電子画像管理加算(単純)
  if (hasXray && !hasEntry(allEntries, "E-DENP")) {
    const e = makeAutoEntry("E-DENP");
    if (e) result.push(e);
  }

  // CT/MRI → コンピューター断層撮影診断料
  if ((hasCT || hasMRI) && !hasEntry(allEntries, "E200-DAN")) {
    const e = makeAutoEntry("E200-DAN");
    if (e) result.push(e);
  }

  // CT/MRI → 電子画像管理加算(CT・MRI)
  if ((hasCT || hasMRI) && !hasEntry(allEntries, "E-DENCT")) {
    const e = makeAutoEntry("E-DENCT");
    if (e) result.push(e);
  }

  // CT/MRI + 時間外 → 時間外緊急院内画像診断加算
  if ((hasCT || hasMRI) && isEmergencyTime && !hasEntry(allEntries, "E-KINKY")) {
    const e = makeAutoEntry("E-KINKY");
    if (e) result.push(e);
    messages.push({
      level: "info",
      message: "時間外のCT/MRI → 時間外緊急院内画像診断加算(110点)を追加しました。画像診断管理加算の届出施設のみ算定可。",
    });
  }

  // 検体検査 + 時間外 → 時間外緊急院内検査加算
  if ((hasBloodTest || hasUrine) && isEmergencyTime && !hasEntry(allEntries, "D-KINKY")) {
    const e = makeAutoEntry("D-KINKY");
    if (e) result.push(e);
    messages.push({
      level: "info",
      message: "時間外の検体検査 → 時間外緊急院内検査加算(110点)を追加しました。検体検査管理加算の届出施設のみ算定可。",
    });
  }

  // ── 処置関連のチェック ──
  const hasWoundCare = hasEntry(allEntries, "J000") || hasEntry(allEntries, "J000-2");
  if (hasWoundCare) {
    messages.push({
      level: "tip",
      message: "創傷処置の注意: 消毒薬(イソジン・ヒビテン等)・ガーゼ・絆創膏は処置点数に含まれるため別算定不可。デブリードマン等が必要な場合は創傷処理(手術)を検討。",
    });
  }

  const hasBurnCare = hasEntry(allEntries, "J001");
  if (hasBurnCare) {
    messages.push({
      level: "tip",
      message: "熱傷処置の注意: 初回は+55点の加算があります(初回加算)。ワセリン・ガーゼ等は処置料に含まれます。",
    });
  }

  // 消炎鎮痛等処置の注意
  if (hasEntry(allEntries, "J119") && hasEntry(allEntries, "J119-2")) {
    messages.push({
      level: "error",
      message: "消炎鎮痛等処置の湿布処置とマッサージ等は同日併算定不可です。どちらか一方のみ算定してください。",
    });
  }

  // 院内トリアージと救急搬送管理料の併算定チェック
  if (hasEntry(allEntries, "B001-2-5") && hasEntry(allEntries, "B001-2-6")) {
    messages.push({
      level: "error",
      message: "院内トリアージ実施料と夜間休日救急搬送医学管理料は併算定不可です。来院方法を確認してください。",
    });
  }

  // SpO2と酸素吸入の注意
  if (hasEntry(allEntries, "D223") && hasEntry(allEntries, "J024")) {
    messages.push({
      level: "tip",
      message: "SpO2と酸素吸入: 酸素吸入を行っている患者のSpO2は酸素吸入の所定点数に含まれるため別に算定できません(令和4年改定)。",
    });
  }

  // 紹介状の提案
  if (hasEntry(allEntries, "B009")) {
    messages.push({
      level: "tip",
      message: "診療情報提供料(I): 検査・画像情報提供加算(+30点)も併せて算定できる場合があります。",
    });
  }

  return { entries: result, messages };
}
