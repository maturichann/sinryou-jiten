/** 診療種別区分 */
export type ShinryouCategory =
  | "shinsa"
  | "igaku_kanri"
  | "zaitaku"
  | "touyaku"
  | "chusha"
  | "shochi"
  | "shujutsu"
  | "masui"
  | "kensa"
  | "gazou"
  | "riha"
  | "sonota";

/** 辞典の1項目 */
export interface DictionaryItem {
  code: string;
  name: string;
  points: number;
  category: ShinryouCategory;
  unit?: string;
  description: string;          // 概要（1-2文）
  whenToBill: string[];         // ✅ こんな時に算定
  cantBill?: string[];          // ❌ 算定できない場合
  tips?: string[];              // 💡 ポイント・注意点
  relatedCodes?: string[];      // 🔗 関連項目コード
  setWith?: string[];           // 🔗 よくセットで算定する項目名
}

/** カテゴリ表示情報 */
export interface CategoryInfo {
  code: string;
  label: string;
  color: string;
  icon: string;
}

/** セット（頻出する組み合わせ） */
export interface BillingSet {
  id: string;
  name: string;
  description: string;
  items: string[];              // 含まれる項目コード
  when: string;                 // いつ使うか
}
