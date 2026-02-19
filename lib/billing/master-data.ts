/**
 * 診療報酬点数マスタ (令和6年度改定)
 * 敦賀病院向けカスタマイズ
 */

import type {
  ShinryouCategory,
  ShinryouItem,
  ConsultationType,
  TimeCategory,
  InsuranceType,
  ArrivalMethod,
} from "./types";

// ─── カテゴリ定義 ───
export const CATEGORY_LABELS: Record<ShinryouCategory, { code: string; label: string; color: string }> = {
  shinsa:      { code: ".11/.12", label: "診察",       color: "#2563eb" },
  igaku_kanri: { code: ".13",    label: "医学管理等",   color: "#7c3aed" },
  zaitaku:     { code: ".14",    label: "在宅医療",     color: "#0891b2" },
  touyaku:     { code: ".21-.27",label: "投薬",         color: "#059669" },
  chusha:      { code: ".31-.34",label: "注射",         color: "#d97706" },
  shochi:      { code: ".40",    label: "処置",         color: "#dc2626" },
  shujutsu:    { code: ".50",    label: "手術",         color: "#be123c" },
  kensa:       { code: ".60",    label: "検査",         color: "#4f46e5" },
  gazou:       { code: ".70",    label: "画像診断",     color: "#0d9488" },
  sonota:      { code: ".80",    label: "その他",       color: "#6b7280" },
};

export const CATEGORY_ORDER: ShinryouCategory[] = [
  "shinsa", "igaku_kanri", "zaitaku", "touyaku", "chusha",
  "shochi", "shujutsu", "kensa", "gazou", "sonota",
];

// ─── 診察料 基本点数テーブル ───
export const BASE_CONSULTATION_POINTS: Record<
  ConsultationType,
  Record<TimeCategory, number>
> = {
  initial: {
    regular: 291,
    night_early: 291,
    off_hours: 376,
    off_hours_special: 376,
    holiday: 541,
    late_night: 771,
  },
  follow_up: {
    regular: 75,
    night_early: 125,
    off_hours: 140,
    off_hours_special: 140,
    holiday: 265,
    late_night: 555,
  },
};

// ─── 診療行為マスタ ───
// helpText: 「いつ算定する？」を初心者にもわかるように記載
// tags: 自動算定ルールで参照するタグ

export const SHINRYOU_ITEMS: ShinryouItem[] = [

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  初診料・再診料 (.11/.12)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    code: "A000", name: "初診料", points: 291, category: "shinsa",
    requiresInitial: true, hidden: true,
    helpText: "初めて来院した患者、または前回の傷病が治癒した後に再度来院した患者に算定。自動で入ります。",
    tags: ["auto_base_consultation"],
  },
  {
    code: "A001", name: "再診料", points: 75, category: "shinsa",
    requiresFollowUp: true, hidden: true,
    helpText: "2回目以降の来院時に算定。自動で入ります。",
    tags: ["auto_base_consultation"],
  },

  // -- 時間帯加算(初診) --
  {
    code: "A000-JIKAN", name: "時間外加算(初診)", points: 85, category: "shinsa",
    requiresInitial: true, hidden: true,
    helpText: "時間外(診療時間外)に初診した場合。自動で入ります。",
    tags: ["auto_time_surcharge"],
  },
  {
    code: "A000-KYUJI", name: "休日加算(初診)", points: 250, category: "shinsa",
    requiresInitial: true, hidden: true,
    helpText: "休日(日曜・祝日・年末年始)に初診した場合。自動で入ります。",
    tags: ["auto_time_surcharge"],
  },
  {
    code: "A000-SHINYA", name: "深夜加算(初診)", points: 480, category: "shinsa",
    requiresInitial: true, hidden: true,
    helpText: "深夜(22時〜翌6時)に初診した場合。自動で入ります。",
    tags: ["auto_time_surcharge"],
  },
  {
    code: "A000-YAKAN", name: "夜間早朝等加算(初診)", points: 50, category: "shinsa",
    requiresInitial: true, hidden: true,
    helpText: "夜間早朝等(18時〜22時, 6時〜8時等)に初診した場合。診療所のみ。自動で入ります。",
    tags: ["auto_time_surcharge"],
  },
  {
    code: "A000-TOKUR", name: "時間外特例加算(初診)", points: 230, category: "shinsa",
    requiresInitial: true, hidden: true,
    helpText: "地域医療に貢献する救急病院等での時間外初診。自動で入ります。",
    tags: ["auto_time_surcharge"],
  },

  // -- 時間帯加算(再診) --
  {
    code: "A001-JIKAN", name: "時間外加算(再診)", points: 65, category: "shinsa",
    requiresFollowUp: true, hidden: true,
    helpText: "時間外に再診した場合。自動で入ります。",
    tags: ["auto_time_surcharge"],
  },
  {
    code: "A001-KYUJI", name: "休日加算(再診)", points: 190, category: "shinsa",
    requiresFollowUp: true, hidden: true,
    helpText: "休日に再診した場合。自動で入ります。",
    tags: ["auto_time_surcharge"],
  },
  {
    code: "A001-SHINYA", name: "深夜加算(再診)", points: 420, category: "shinsa",
    requiresFollowUp: true, hidden: true,
    helpText: "深夜に再診した場合。自動で入ります。",
    tags: ["auto_time_surcharge"],
  },
  {
    code: "A001-YAKAN", name: "夜間早朝等加算(再診)", points: 50, category: "shinsa",
    requiresFollowUp: true, hidden: true,
    helpText: "夜間早朝等に再診した場合。診療所のみ。自動で入ります。",
    tags: ["auto_time_surcharge"],
  },
  {
    code: "A001-TOKUR", name: "時間外特例加算(再診)", points: 180, category: "shinsa",
    requiresFollowUp: true, hidden: true,
    helpText: "時間外特例での再診。自動で入ります。",
    tags: ["auto_time_surcharge"],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  診察加算 (.11/.12)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    code: "A001-ADD", name: "外来管理加算", points: 52, category: "shinsa",
    requiresFollowUp: true,
    conflicts: ["shochi","kensa","gazou","chusha","shujutsu","sonota"],
    helpText: "再診で、処置・検査・注射・リハビリなど何もしなかった場合に算定。問診・身体観察のみの日に取れる。",
    tags: ["auto_followup_no_procedure"],
  },
  {
    code: "A003", name: "明細書発行体制等加算", points: 1, category: "shinsa",
    helpText: "すべての患者さんに毎回自動算定。明細書を発行する体制がある医療機関で取れる。",
    tags: ["auto_always"],
  },
  {
    code: "A000-INF", name: "乳幼児加算(初診)", points: 75, category: "shinsa",
    requiresInitial: true, ageRestriction: "infant",
    helpText: "6歳未満のお子さんの初診時に自動算定。",
    tags: ["auto_infant_initial"],
  },
  {
    code: "A001-INF", name: "乳幼児加算(再診)", points: 38, category: "shinsa",
    requiresFollowUp: true, ageRestriction: "infant",
    helpText: "6歳未満のお子さんの再診時に自動算定。",
    tags: ["auto_infant_followup"],
  },
  {
    code: "A002", name: "地域包括診療加算1", points: 25, category: "shinsa",
    requiresFollowUp: true,
    helpText: "慢性疾患を2つ以上持つ患者の再診時。かかりつけ医機能として服薬管理等を行う場合。届出が必要。",
  },
  {
    code: "A910", name: "時間外対応加算1", points: 5, category: "shinsa",
    requiresFollowUp: true, unit: "月1回",
    helpText: "24時間の電話等対応ができる体制を持つ診療所で、再診時に月1回算定。届出が必要。",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  医学管理等 (.13)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    code: "B000", name: "特定疾患療養管理料(診療所)", points: 225, category: "igaku_kanri",
    unit: "月2回",
    helpText: "【診療所のみ】高血圧・糖尿病・脂質異常症・喘息など厚労省指定の特定疾患が主病の患者に、治療計画に基づいて療養指導した場合。月2回まで。初診月は算定不可。",
  },
  {
    code: "B000-2", name: "特定疾患療養管理料(100床未満)", points: 147, category: "igaku_kanri",
    unit: "月2回",
    helpText: "【100床未満の病院】特定疾患が主病の患者への療養指導。敦賀病院では通常こちらではなく下の200床未満を使用。",
  },
  {
    code: "B000-3", name: "特定疾患療養管理料(200床未満)", points: 87, category: "igaku_kanri",
    unit: "月2回",
    helpText: "【200床未満の病院】特定疾患が主病の患者への療養指導。月2回まで。初診月は算定不可。",
  },
  {
    code: "B001-2", name: "特定薬剤治療管理料1", points: 470, category: "igaku_kanri",
    unit: "月1回",
    helpText: "抗てんかん薬・免疫抑制剤・ジギタリスなどの血中濃度を測定して投与量を管理する場合。月1回。初回月は280点加算あり。",
  },
  {
    code: "B001-3", name: "悪性腫瘍特異物質治療管理料", points: 360, category: "igaku_kanri",
    unit: "月1回",
    helpText: "がん患者に腫瘍マーカー検査(CEA, CA19-9, PSA等)を行い、その結果に基づいて治療管理した場合。月1回。腫瘍マーカーの検査料は別に算定不可(管理料に含まれる)。",
  },
  {
    code: "B001-6", name: "てんかん指導料", points: 250, category: "igaku_kanri",
    unit: "月1回",
    helpText: "てんかんの患者(家族)に治療計画に基づく療養指導を行った場合。月1回。主病がてんかんの場合。",
  },
  {
    code: "B001-7", name: "難病外来指導管理料", points: 270, category: "igaku_kanri",
    unit: "月1回",
    helpText: "厚労省指定の難病の患者に療養指導を行った場合。月1回。特定疾患療養管理料とは併算定不可。",
  },
  {
    code: "B001-9", name: "外来栄養食事指導料1(初回)", points: 260, category: "igaku_kanri",
    helpText: "管理栄養士が患者に初回の栄養指導を行った場合(30分以上)。糖尿病、腎臓病、心臓病等で特別食が必要な患者が対象。",
  },
  {
    code: "B001-9b", name: "外来栄養食事指導料1(2回目以降)", points: 200, category: "igaku_kanri",
    helpText: "管理栄養士による2回目以降の栄養指導(20分以上)。",
  },
  {
    code: "B001-20", name: "糖尿病合併症管理料", points: 170, category: "igaku_kanri",
    unit: "月1回",
    helpText: "糖尿病足病変ハイリスク要因のある患者に、医師と看護師が足の観察・指導を行った場合。月1回。",
  },
  {
    code: "B001-22", name: "がん性疼痛緩和指導管理料", points: 200, category: "igaku_kanri",
    unit: "月1回",
    helpText: "がんの痛みがある患者にWHO方式のがん疼痛治療法に基づく鎮痛療法を行い、療養指導した場合。月1回。",
  },
  {
    code: "B001-31", name: "薬剤情報提供料", points: 10, category: "igaku_kanri",
    unit: "月1回",
    helpText: "院内処方で薬を出す時に薬の名前・用法・効果・副作用などの文書を渡した場合。月1回。院外処方では算定不可。",
    tags: ["auto_院内処方"],
  },
  {
    code: "B001-32", name: "手帳記載加算", points: 3, category: "igaku_kanri",
    helpText: "薬剤情報提供料に加算。お薬手帳に薬剤情報を記載した場合。",
  },
  {
    code: "B001-2-5", name: "院内トリアージ実施料", points: 300, category: "igaku_kanri",
    helpText: "夜間・休日・深夜にウォークイン(自力来院)した初診患者に院内トリアージを実施した場合。救急車搬送の患者は対象外。夜間休日救急搬送医学管理料との併算定不可。",
    tags: ["auto_walk_in_emergency"],
  },
  {
    code: "B001-2-6", name: "夜間休日救急搬送医学管理料", points: 600, category: "igaku_kanri",
    helpText: "夜間・休日・深夜に救急車・ドクターヘリで搬送された初診患者に算定。第二次救急以上。院内トリアージ実施料との併算定不可。",
    tags: ["auto_ambulance_emergency"],
  },
  {
    code: "B001-2-6-2", name: "救急搬送看護体制加算2", points: 200, category: "igaku_kanri",
    helpText: "夜間休日救急搬送医学管理料に加算。年間200件以上の救急搬送実績があり専任看護師を配置している場合。",
    tags: ["auto_ambulance_emergency_addon"],
  },
  {
    code: "B009", name: "診療情報提供料(I)", points: 250, category: "igaku_kanri",
    helpText: "他の医療機関に紹介状(診療情報提供書)を書いた場合。月1回(同一医療機関あて)。紹介先ごとに算定可。",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  在宅医療 (.14)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    code: "C001", name: "在宅患者訪問診療料(I) 同一建物以外", points: 888, category: "zaitaku",
    helpText: "通院できない患者の自宅に訪問して診療した場合(同じ建物に他の訪問患者がいない場合)。",
  },
  {
    code: "C001-2", name: "在宅患者訪問診療料(I) 同一建物", points: 213, category: "zaitaku",
    helpText: "同じ建物(施設等)に2人以上の訪問診療患者がいる場合。",
  },
  {
    code: "C101", name: "在宅自己注射指導管理料(複雑)", points: 1230, category: "zaitaku",
    unit: "月1回",
    helpText: "インスリン製剤等を自己注射している患者に指導管理した場合(間歇注入シリンジポンプ使用等の複雑なもの)。月1回。",
  },
  {
    code: "C101-2", name: "在宅自己注射指導管理料(月28回以上)", points: 810, category: "zaitaku",
    unit: "月1回",
    helpText: "インスリン注射を毎日打っている患者(月28回以上)への指導管理。月1回。",
  },
  {
    code: "C101-3", name: "在宅自己注射指導管理料(月27回以下)", points: 650, category: "zaitaku",
    unit: "月1回",
    helpText: "週1回製剤など月27回以下の自己注射患者への指導管理。月1回。",
  },
  {
    code: "C150", name: "血糖自己測定器加算(月20回以上)", points: 350, category: "zaitaku",
    unit: "月1回",
    helpText: "在宅自己注射の患者が自分で血糖を測定する場合(月20回以上60回未満)。自己注射指導管理料に加算。",
  },
  {
    code: "C150-3", name: "血糖自己測定器加算(月60回以上)", points: 580, category: "zaitaku",
    unit: "月1回",
    helpText: "1日2回以上の血糖測定(月60回以上)の場合。",
  },
  {
    code: "C153", name: "注入器用注射針加算", points: 130, category: "zaitaku",
    unit: "月1回",
    helpText: "注射針を処方した場合。在宅自己注射指導管理料に加算。月1回。",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  投薬 (.21-.27)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    code: "F100", name: "処方料", points: 42, category: "touyaku",
    helpText: "【院内処方の場合】院内で薬を出す時に算定(6種類以下)。院外処方の場合は処方箋料を使う。",
  },
  {
    code: "F100-2", name: "処方料(7種類以上)", points: 29, category: "touyaku",
    helpText: "【院内処方で7種類以上】薬の種類が7以上ある場合の処方料。減点されるので6種類以下が望ましい。",
  },
  {
    code: "F400", name: "処方箋料", points: 68, category: "touyaku",
    helpText: "【院外処方の場合】処方箋を発行した場合(6種類以下)。院内処方の場合は処方料を使う。",
  },
  {
    code: "F400-7", name: "処方箋料(7種類以上)", points: 40, category: "touyaku",
    helpText: "【院外処方で7種類以上】薬の種類が7以上の処方箋。",
  },
  {
    code: "F400-G", name: "一般名処方加算1", points: 7, category: "touyaku",
    helpText: "処方箋に1品目以上を一般名(商品名ではなく成分名)で記載した場合。処方箋料に加算。",
    tags: ["auto_院外処方"],
  },
  {
    code: "F400-G2", name: "一般名処方加算2", points: 5, category: "touyaku",
    helpText: "すべての薬を一般名で記載した場合。加算1(7点)とは併算定不可。どちらか高い方を選ぶ。",
  },
  {
    code: "F500", name: "調剤技術基本料", points: 14, category: "touyaku",
    unit: "月1回",
    helpText: "【院内処方の場合のみ】薬剤師が調剤した場合に月1回。院外処方では算定不可。",
    tags: ["auto_院内処方"],
  },
  {
    code: "F-TONYA", name: "調剤料(内服/1剤につき)", points: 11, category: "touyaku",
    helpText: "院内処方で内服薬の調剤をした場合。1剤(服用時点が同じグループ)につき11点。",
  },
  {
    code: "F-TONPU", name: "調剤料(頓服)", points: 21, category: "touyaku",
    helpText: "院内処方で頓服薬を調剤した場合。",
  },
  {
    code: "F-GAIY", name: "調剤料(外用)", points: 8, category: "touyaku",
    helpText: "院内処方で外用薬(塗り薬・目薬・湿布等)を調剤した場合。",
  },
  {
    code: "F200", name: "薬剤料(点数直接入力)", points: 0, category: "touyaku",
    helpText: "薬の値段を点数で直接入力する場合に使用。薬価÷10＝点数(五捨五超入)。",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  注射 (.31-.34)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    code: "G000", name: "皮下筋肉内注射", points: 22, category: "chusha",
    helpText: "皮下または筋肉内に注射した場合。ワクチン接種(皮下注)などでも使用。",
  },
  {
    code: "G001", name: "静脈内注射", points: 34, category: "chusha",
    helpText: "静脈に直接薬液を注射した場合(ワンショット)。点滴とは別。",
  },
  {
    code: "G004", name: "点滴注射(500mL以上)", points: 98, category: "chusha",
    helpText: "点滴の総量が500mL以上の場合。生食500mL+薬剤など。",
  },
  {
    code: "G004-2", name: "点滴注射(500mL未満)", points: 49, category: "chusha",
    helpText: "点滴の総量が500mL未満の場合。側管から薬を入れるだけの場合なども。",
  },
  {
    code: "G005", name: "中心静脈注射", points: 140, category: "chusha",
    helpText: "中心静脈カテーテル(CVカテーテル)から薬液を注入した場合。",
  },
  {
    code: "G-YAKU", name: "注射薬剤料(点数直接入力)", points: 0, category: "chusha",
    helpText: "注射薬の薬剤料を点数で直接入力。薬価÷10＝点数。",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  処置 (.40)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    code: "J000", name: "創傷処置(100cm²未満)", points: 55, category: "shochi",
    helpText: "切り傷・すり傷の消毒やガーゼ交換。傷の大きさが100cm²(約10cm×10cm)未満の場合。",
  },
  {
    code: "J000-2", name: "創傷処置(100～500cm²)", points: 85, category: "shochi",
    helpText: "100cm²以上500cm²未満の傷の処置。",
  },
  {
    code: "J001", name: "熱傷処置(100cm²未満)", points: 147, category: "shochi",
    helpText: "やけどの処置。初回は+55点の加算あり。面積が100cm²未満の場合。",
  },
  {
    code: "J018", name: "喀痰吸引", points: 48, category: "shochi",
    helpText: "痰を吸引器で吸い取った場合。1日につき。",
  },
  {
    code: "J024", name: "酸素吸入", points: 65, category: "shochi",
    helpText: "酸素マスクやカニューラで酸素を吸入させた場合。1日につき。酸素代は別途算定。",
  },
  {
    code: "J038", name: "人工腎臓(4時間未満)", points: 1924, category: "shochi",
    helpText: "透析。4時間未満の場合。慢性維持透析患者。",
  },
  {
    code: "J038-2", name: "人工腎臓(4時間以上5時間未満)", points: 2084, category: "shochi",
    helpText: "透析。4時間以上5時間未満。最も一般的な透析時間。",
  },
  {
    code: "J054", name: "皮膚科軟膏処置(100cm²未満)", points: 55, category: "shochi",
    helpText: "湿疹・皮膚炎に軟膏を塗布した場合。100cm²未満。",
  },
  {
    code: "J063", name: "留置カテーテル設置", points: 40, category: "shochi",
    helpText: "尿道に留置カテーテル(バルーン)を入れた場合。",
  },
  {
    code: "J095", name: "耳処置", points: 27, category: "shochi",
    helpText: "耳の洗浄、異物除去、薬液滴下など耳鼻科的処置。",
  },
  {
    code: "J097", name: "鼻処置", points: 14, category: "shochi",
    helpText: "鼻腔の洗浄、薬液滴下、吸引など。",
  },
  {
    code: "J098", name: "口腔・咽頭処置", points: 14, category: "shochi",
    helpText: "口の中やのどの消毒、薬液塗布など。",
  },
  {
    code: "J119", name: "消炎鎮痛等処置(湿布)", points: 35, category: "shochi",
    helpText: "湿布を貼る処置。外来では1日につき。マッサージ・器具等と同日併算定不可。",
  },
  {
    code: "J119-2", name: "消炎鎮痛等処置(マッサージ等)", points: 35, category: "shochi",
    helpText: "マッサージ、温熱療法(ホットパック等)、低周波治療など。1日につき。",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  検査 (.60)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // -- 尿検査 --
  {
    code: "D000", name: "尿中一般物質定性半定量検査", points: 26, category: "kensa",
    helpText: "いわゆる「尿検査」。テステープで蛋白・糖・潜血・ケトン体等を調べる。一番基本の検査。",
    tags: ["urine"],
  },
  {
    code: "D002", name: "尿沈渣(鏡検法)", points: 27, category: "kensa",
    helpText: "尿を遠心分離して顕微鏡で細胞や結晶を観察。尿蛋白や潜血が陽性の時にさらに詳しく調べる。",
    tags: ["urine"],
  },

  // -- 血液学検査 --
  {
    code: "D005", name: "末梢血液一般", points: 21, category: "kensa",
    helpText: "CBC。白血球(WBC)・赤血球(RBC)・Hb・Ht・血小板を調べる最も基本の血液検査。貧血・感染症のスクリーニングに。",
    tags: ["blood","hematology"],
  },
  {
    code: "D005-5", name: "末梢血液像(自動機械法)", points: 15, category: "kensa",
    helpText: "白血球の種類(好中球・リンパ球等)の比率を機械で分類。感染症や血液疾患の鑑別に。",
    tags: ["blood","hematology"],
  },
  {
    code: "D005-6", name: "末梢血液像(鏡検法)", points: 25, category: "kensa",
    helpText: "白血球分類を顕微鏡で行う。機械法で異常が出た時に実施。",
    tags: ["blood","hematology"],
  },
  {
    code: "D006-5", name: "PT(プロトロンビン時間)", points: 18, category: "kensa",
    helpText: "血液の固まりやすさを調べる。ワーファリン服用患者の用量調整や手術前検査に必須。",
    tags: ["blood","hematology"],
  },
  {
    code: "D006-6", name: "APTT", points: 29, category: "kensa",
    helpText: "内因性凝固の検査。ヘパリン使用中のモニタリングや術前検査に。",
    tags: ["blood","hematology"],
  },

  // -- 生化学検査 --
  {
    code: "D007-1", name: "総蛋白(TP)", points: 11, category: "kensa",
    helpText: "血液中の蛋白質の総量。栄養状態や肝機能の指標。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-2", name: "アルブミン(Alb)", points: 11, category: "kensa",
    helpText: "栄養状態を反映する重要な蛋白質。低いと浮腫や腹水の原因に。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-3", name: "総ビリルビン(T-Bil)", points: 11, category: "kensa",
    helpText: "黄疸の指標。肝臓・胆道の異常や溶血で上昇する。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-5", name: "AST(GOT)", points: 17, category: "kensa",
    helpText: "肝臓の酵素。肝炎・肝硬変で上昇。心筋梗塞でも上がる。ALTとセットで見ることが多い。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-6", name: "ALT(GPT)", points: 17, category: "kensa",
    helpText: "肝臓に特異的な酵素。肝炎の指標として最も重要。ASTとセットで。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-7", name: "γ-GT(γ-GTP)", points: 17, category: "kensa",
    helpText: "肝臓・胆道の酵素。飲酒や胆石、薬剤性肝障害で上昇。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-8", name: "LD(LDH)", points: 11, category: "kensa",
    helpText: "全身の組織障害で上昇する酵素。心臓・肝臓・血液疾患・悪性腫瘍で上がる。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-9", name: "ALP", points: 11, category: "kensa",
    helpText: "肝臓・胆道・骨の酵素。胆石による胆汁うっ滞や骨疾患で上昇。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-13", name: "総コレステロール(TC)", points: 17, category: "kensa",
    helpText: "脂質異常症のスクリーニング。LDL・HDLと合わせて評価。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-14", name: "中性脂肪(TG)", points: 11, category: "kensa",
    helpText: "脂質異常症の指標。食後に上がるので空腹時採血が望ましい。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-15", name: "HDLコレステロール", points: 17, category: "kensa",
    helpText: "善玉コレステロール。低いと動脈硬化のリスクが上がる。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-16", name: "LDLコレステロール", points: 18, category: "kensa",
    helpText: "悪玉コレステロール。高いと動脈硬化のリスク。脂質異常症の治療目標として最も重要。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-17", name: "尿素窒素(BUN)", points: 11, category: "kensa",
    helpText: "腎機能の指標。腎不全や脱水で上昇。クレアチニンとセットで見る。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-18", name: "クレアチニン(Cre)", points: 11, category: "kensa",
    helpText: "腎機能の最も重要な指標。eGFRの計算に使用。腎不全で上昇。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-19", name: "尿酸(UA)", points: 11, category: "kensa",
    helpText: "高いと痛風や腎結石のリスク。7.0mg/dL以上で高尿酸血症。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-20", name: "血糖(BS)", points: 11, category: "kensa",
    helpText: "血液中のブドウ糖濃度。糖尿病の診断・管理に。空腹時・随時・負荷後で基準値が異なる。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-21", name: "HbA1c", points: 49, category: "kensa",
    helpText: "過去1～2ヶ月の血糖の平均を反映。糖尿病のコントロール指標。6.5%以上で糖尿病型。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-CRP", name: "CRP定量", points: 16, category: "kensa",
    helpText: "炎症の指標。感染症・自己免疫疾患・がんなど様々な炎症で上昇。最も基本的な炎症マーカー。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-Na", name: "Na(ナトリウム)", points: 11, category: "kensa",
    helpText: "電解質。脱水・心不全・SIADH等で異常値に。K・Clとセットで測定することが多い。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-K", name: "K(カリウム)", points: 11, category: "kensa",
    helpText: "電解質。高すぎると不整脈のリスク。腎不全・利尿剤・ARB使用時にチェック。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-Cl", name: "Cl(クロール)", points: 11, category: "kensa",
    helpText: "電解質。Na・Kと合わせて酸塩基平衡の評価に。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-Ca", name: "Ca(カルシウム)", points: 11, category: "kensa",
    helpText: "骨代謝・副甲状腺機能の指標。悪性腫瘍の高Ca血症の発見にも。",
    tags: ["blood","biochem"],
  },
  {
    code: "D007-Fe", name: "Fe(鉄)", points: 11, category: "kensa",
    helpText: "鉄欠乏性貧血の診断に。フェリチンと合わせて評価すると鉄欠乏の程度がわかる。",
    tags: ["blood","biochem"],
  },

  // -- 内分泌検査 --
  {
    code: "D008-TSH", name: "TSH", points: 104, category: "kensa",
    helpText: "甲状腺刺激ホルモン。甲状腺機能のスクリーニングに最も重要。FT3・FT4とセットで。",
    tags: ["blood","immunology"],
  },
  {
    code: "D008-FT3", name: "FT3", points: 131, category: "kensa",
    helpText: "遊離トリヨードサイロニン。甲状腺ホルモンの活性型。バセドウ病で上昇。",
    tags: ["blood","immunology"],
  },
  {
    code: "D008-FT4", name: "FT4", points: 119, category: "kensa",
    helpText: "遊離サイロキシン。甲状腺機能低下症で低下、亢進症で上昇。",
    tags: ["blood","immunology"],
  },

  // -- 腫瘍マーカー --
  {
    code: "D008-PSA", name: "PSA(前立腺特異抗原)", points: 130, category: "kensa",
    helpText: "前立腺がんの腫瘍マーカー。スクリーニングと治療効果判定に。4.0ng/mL以上で精密検査。",
    tags: ["blood","immunology"],
  },

  // -- 免疫検査 --
  {
    code: "D015-RF", name: "RF定量(リウマトイド因子)", points: 30, category: "kensa",
    helpText: "関節リウマチの診断補助。ただし健常者でも陽性になることがある(偽陽性)。",
    tags: ["blood","immunology"],
  },
  {
    code: "D015-ANA", name: "抗核抗体(蛍光抗体法)", points: 110, category: "kensa",
    helpText: "SLE(全身性エリテマトーデス)等の膠原病のスクリーニング。",
    tags: ["blood","immunology"],
  },

  // -- 感染症検査 --
  {
    code: "D023-HBs", name: "HBs抗原", points: 29, category: "kensa",
    helpText: "B型肝炎ウイルスの感染の有無を調べる。術前検査のセットに含まれることが多い。",
    tags: ["blood","immunology"],
  },
  {
    code: "D023-HCV", name: "HCV抗体", points: 107, category: "kensa",
    helpText: "C型肝炎ウイルスの感染歴を調べる。術前検査に含まれることが多い。",
    tags: ["blood","immunology"],
  },
  {
    code: "D012-RPR", name: "RPR(梅毒定性)", points: 15, category: "kensa",
    helpText: "梅毒のスクリーニング検査。術前検査に含まれることが多い。",
    tags: ["blood","immunology"],
  },

  // -- 生理検査 --
  {
    code: "D208", name: "心電図(12誘導)", points: 130, category: "kensa",
    helpText: "不整脈・狭心症・心筋梗塞の診断に。胸痛や動悸の訴え、術前検査で実施。",
    tags: ["physiology"],
  },
  {
    code: "D215", name: "超音波検査(断層/胸腹部)", points: 530, category: "kensa",
    helpText: "腹部エコー。肝臓・胆嚢・腎臓・膵臓・脾臓を観察。腹痛・肝機能異常の精査に。",
    tags: ["physiology"],
  },
  {
    code: "D215-2", name: "超音波検査(断層/その他)", points: 350, category: "kensa",
    helpText: "心エコー・頸動脈エコー・甲状腺エコー・乳腺エコーなど。部位ごとに算定可。",
    tags: ["physiology"],
  },
  {
    code: "D223", name: "経皮的動脈血酸素飽和度測定(SpO2)", points: 35, category: "kensa",
    helpText: "パルスオキシメーターでSpO2を測定。呼吸不全の管理に。1日につき。酸素吸入等の処置と同日算定は注意。",
    tags: ["physiology"],
  },
  {
    code: "D256", name: "眼底検査", points: 56, category: "kensa",
    helpText: "糖尿病網膜症・高血圧性眼底変化・緑内障の評価。糖尿病の定期検査として重要。",
    tags: ["physiology"],
  },

  // -- 検体検査判断料 --
  {
    code: "D-PHAN", name: "検体検査判断料(生化学I)", points: 144, category: "kensa",
    unit: "月1回",
    helpText: "生化学検査(肝機能・腎機能・脂質・血糖等)を実施した月に算定。月1回のみ。",
    tags: ["auto_biochem_judgment"],
  },
  {
    code: "D-PHKE", name: "検体検査判断料(血液学)", points: 125, category: "kensa",
    unit: "月1回",
    helpText: "血算(CBC)・凝固検査を実施した月に算定。月1回のみ。",
    tags: ["auto_hematology_judgment"],
  },
  {
    code: "D-PHBI", name: "検体検査判断料(免疫学)", points: 144, category: "kensa",
    unit: "月1回",
    helpText: "CRP・甲状腺ホルモン・HBs抗原・腫瘍マーカー等の免疫検査を実施した月に算定。月1回のみ。",
    tags: ["auto_immunology_judgment"],
  },
  {
    code: "D-PHNI", name: "検体検査判断料(尿・糞便等)", points: 34, category: "kensa",
    unit: "月1回",
    helpText: "尿検査(尿一般・尿沈渣)を実施した月に算定。月1回のみ。",
    tags: ["auto_urine_judgment"],
  },
  {
    code: "D-SAIK", name: "採血料(静脈)", points: 37, category: "kensa",
    helpText: "静脈から採血した場合。血液検査を行う日には必ず算定。1日1回。",
    tags: ["auto_blood_sampling"],
  },
  {
    code: "D-KINKY", name: "時間外緊急院内検査加算", points: 110, category: "kensa",
    helpText: "時間外・休日・深夜に入院中以外の患者に緊急で検体検査を院内で実施し、結果を速やかに説明した場合。1日1回。検体検査管理加算の届出施設のみ算定可。",
    tags: ["auto_emergency_lab"],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  画像診断 (.70)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    code: "E001-2", name: "写真診断(単純/胸部)", points: 85, category: "gazou",
    helpText: "胸部レントゲンの読影料。肺炎・心不全・肺がんのスクリーニングに。撮影料と別に算定。",
    tags: ["xray"],
  },
  {
    code: "E001-3", name: "写真診断(単純/腹部)", points: 85, category: "gazou",
    helpText: "腹部レントゲンの読影料。腸閉塞・尿路結石のスクリーニングに。",
    tags: ["xray"],
  },
  {
    code: "E001-4", name: "写真診断(単純/その他)", points: 43, category: "gazou",
    helpText: "骨・関節・頭部等のレントゲンの読影料。骨折の確認など。",
    tags: ["xray"],
  },
  {
    code: "E002-D", name: "撮影料(デジタル/単純)", points: 68, category: "gazou",
    helpText: "デジタルレントゲン撮影の技術料。フィルムレスの場合はこちら。ほとんどの施設がデジタル。",
    tags: ["xray"],
  },
  {
    code: "E-DENP", name: "電子画像管理加算(単純撮影)", points: 57, category: "gazou",
    helpText: "レントゲン画像をデジタル保存(PACS等)している場合に撮影のつど加算。",
    tags: ["auto_xray_digital"],
  },

  // -- CT --
  {
    code: "E200", name: "CT撮影(16列以上マルチスライス)", points: 900, category: "gazou",
    helpText: "高性能CTでの撮影料。がん精査、脳出血、肺塞栓等の精密検査に。造影の有無で点数は同じ。",
    tags: ["ct"],
  },
  {
    code: "E200-2", name: "CT撮影(16列未満マルチスライス)", points: 770, category: "gazou",
    helpText: "16列未満のCTでの撮影料。",
    tags: ["ct"],
  },
  {
    code: "E200-DAN", name: "コンピューター断層撮影診断料", points: 450, category: "gazou",
    helpText: "CT・MRIの画像を読影・診断した場合の診断料。撮影料とは別に算定。月2回目以降は所定点数の80%。",
    tags: ["auto_ct_mri_diagnosis"],
  },
  {
    code: "E-DENCT", name: "電子画像管理加算(CT・MRI)", points: 120, category: "gazou",
    helpText: "CT・MRI画像をデジタル保存(PACS等)している場合に加算。",
    tags: ["auto_ct_mri_digital"],
  },
  {
    code: "E-KINKY", name: "時間外緊急院内画像診断加算", points: 110, category: "gazou",
    helpText: "時間外・休日・深夜に緊急でCT・MRI等の画像診断を行い、放射線科医が文書で報告した場合。画像診断管理加算の届出が必要。",
    tags: ["auto_emergency_imaging"],
  },

  // -- MRI --
  {
    code: "E202", name: "MRI撮影(1.5T以上3T未満)", points: 1330, category: "gazou",
    helpText: "MRIでの撮影料。脳・脊髄・関節・肝臓等の精密検査に。放射線被曝なし。",
    tags: ["mri"],
  },
  {
    code: "E202-2", name: "MRI撮影(3T以上)", points: 1620, category: "gazou",
    helpText: "3テスラ以上の高磁場MRI。より高精細な画像が撮れる。",
    tags: ["mri"],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  その他 (.80) リハビリ・精神科等
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    code: "H001", name: "脳血管疾患等リハビリ料(I)", points: 245, category: "sonota",
    unit: "単位(20分)",
    helpText: "脳卒中等の患者のリハビリ。1単位20分。PT・OT・STが実施。施設基準Iの場合。発症から180日まで。",
  },
  {
    code: "H002", name: "運動器リハビリ料(I)", points: 185, category: "sonota",
    unit: "単位(20分)",
    helpText: "骨折・腰痛・関節疾患等の運動器リハビリ。1単位20分。発症から150日まで。",
  },
  {
    code: "H002-2", name: "運動器リハビリ料(II)", points: 170, category: "sonota",
    unit: "単位(20分)",
    helpText: "施設基準IIの場合の運動器リハビリ。",
  },
  {
    code: "H003", name: "呼吸器リハビリ料(I)", points: 175, category: "sonota",
    unit: "単位(20分)",
    helpText: "COPD・肺炎後の呼吸リハビリ。1単位20分。発症から90日まで。",
  },
  {
    code: "H007", name: "障害児(者)リハビリ料", points: 225, category: "sonota",
    unit: "単位(20分)",
    helpText: "障害のあるお子さん・大人のリハビリ。算定日数の上限なし。",
  },
  {
    code: "I002", name: "通院・在宅精神療法(30分以上)", points: 400, category: "sonota",
    helpText: "精神科の外来で30分以上の精神療法を行った場合。うつ病・統合失調症等の患者に。",
  },
  {
    code: "I002-2", name: "通院・在宅精神療法(30分未満)", points: 330, category: "sonota",
    helpText: "精神科の外来で30分未満の精神療法。",
  },
];

// ─── 表示ラベル ───
export const CONSULTATION_TYPE_LABELS: Record<ConsultationType, string> = {
  initial: "初診",
  follow_up: "再診",
};

export const TIME_CATEGORY_LABELS: Record<TimeCategory, string> = {
  regular: "時間内",
  night_early: "夜間・早朝等",
  off_hours: "時間外",
  off_hours_special: "時間外特例",
  holiday: "休日",
  late_night: "深夜",
};

export const INSURANCE_TYPE_LABELS: Record<InsuranceType, string> = {
  shakai: "社保",
  kokuho: "国保",
  kouki: "後期高齢",
  jihi: "自費",
};

export const ARRIVAL_METHOD_LABELS: Record<ArrivalMethod, string> = {
  regular: "通常",
  walk_in: "ウォークイン",
  ambulance: "救急車",
};

// ─── 時間帯加算コードマッピング ───
export const TIME_SURCHARGE_CODES: Record<
  ConsultationType,
  Record<TimeCategory, string | null>
> = {
  initial: {
    regular: null,
    night_early: "A000-YAKAN",
    off_hours: "A000-JIKAN",
    off_hours_special: "A000-TOKUR",
    holiday: "A000-KYUJI",
    late_night: "A000-SHINYA",
  },
  follow_up: {
    regular: null,
    night_early: "A001-YAKAN",
    off_hours: "A001-JIKAN",
    off_hours_special: "A001-TOKUR",
    holiday: "A001-KYUJI",
    late_night: "A001-SHINYA",
  },
};

export const POINT_TO_YEN = 10;
