/** 診療種別区分 */
export type ShinryouCategory =
  | "shinsa"
  | "igaku_kanri"
  | "zaitaku"
  | "touyaku"
  | "chusha"
  | "shochi"
  | "shujutsu"
  | "kensa"
  | "gazou"
  | "sonota";

/** 診察種別 */
export type ConsultationType = "initial" | "follow_up";

/** 時間帯区分 */
export type TimeCategory =
  | "regular"
  | "night_early"
  | "off_hours"
  | "off_hours_special"
  | "holiday"
  | "late_night";

/** 来院方法 */
export type ArrivalMethod = "regular" | "walk_in" | "ambulance";

/** 保険種別 */
export type InsuranceType = "shakai" | "kokuho" | "kouki" | "jihi";

/** 負担割合 */
export type CopayRatio = 0 | 0.1 | 0.2 | 0.3 | 1.0;

/** 診療行為マスタの1項目 */
export interface ShinryouItem {
  code: string;
  name: string;
  points: number;
  category: ShinryouCategory;
  unit?: string;
  defaultQty?: number;
  helpText?: string;           // いつ算定するか等の説明
  description?: string;        // 短い補足
  conflicts?: string[];
  requiresFollowUp?: boolean;
  requiresInitial?: boolean;
  ageRestriction?: "infant" | "preschool" | "child" | "elderly";
  tags?: string[];             // 自動算定用タグ
  warnings?: string[];         // この項目を追加した時に表示する注意事項
  hidden?: boolean;            // ピッカーに表示しない(自動算定専用)
}

/** 入力された1行 */
export interface EntryLine {
  id: string;
  itemCode: string;
  quantity: number;
  subtotal: number;
  isAutoAdded?: boolean;       // 自動算定で追加された項目
}

/** 患者情報 */
export interface PatientInfo {
  insuranceType: InsuranceType;
  copayRatio: CopayRatio;
  age: number;
}

/** 診察情報 */
export interface ConsultationInfo {
  type: ConsultationType;
  timeCategory: TimeCategory;
  arrivalMethod: ArrivalMethod;
  date: string;
}

/** 会計データ全体 */
export interface BillingSession {
  patient: PatientInfo;
  consultation: ConsultationInfo;
  entries: EntryLine[];
}

/** バリデーションメッセージ */
export interface ValidationMessage {
  level: "error" | "warning" | "info" | "tip";
  message: string;
  relatedCodes?: string[];
}

/** カテゴリ別小計 */
export interface CategorySubtotal {
  category: ShinryouCategory;
  label: string;
  points: number;
  items: { name: string; points: number; quantity: number }[];
}

/** 計算結果 */
export interface BillingResult {
  categorySubtotals: CategorySubtotal[];
  totalPoints: number;
  totalYen: number;
  patientCharge: number;
  insuranceClaim: number;
  messages: ValidationMessage[];
}
