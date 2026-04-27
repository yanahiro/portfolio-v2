export type Role = "PM" | "PL" | "SE" | "PG";

export type Work = {
  id: string;
  no: number;
  industry: string;
  title: string;
  summary: string;
  roles: Role[];
  os: string[];
  db: string[];
  stack: string[];
  start: string;
  end: string;
  phase: string;
  scaleMonths: number;
};

export const WORKS: Work[] = [
  {
    id: "ranking-service",
    no: 1,
    industry: "Service",
    title: "評価ランキングサービス",
    summary:
      "AWS 上で稼働する評価ランキング SaaS。要件定義から運用までフルフェーズで参画し、設計・実装・チームマネジメントを担当。",
    roles: ["PM", "PL", "SE", "PG"],
    os: ["AWS"],
    db: ["Aurora"],
    stack: ["PHP", "TypeScript", "JavaScript"],
    start: "2017/02",
    end: "2018/05",
    phase: "RD〜OP",
    scaleMonths: 54,
  },
  {
    id: "ai-content",
    no: 2,
    industry: "AI / Media",
    title: "AI コンテンツ生成プラットフォーム",
    summary:
      "GPT / Claude を組み合わせたコンテンツ生成 + 編集ツール。RAG・Agent 設計、推論コスト最適化を担当。",
    roles: ["PL", "SE", "PG"],
    os: ["AWS"],
    db: ["PostgreSQL"],
    stack: ["TypeScript", "Python", "OpenAI", "Claude"],
    start: "2024/06",
    end: "2025/03",
    phase: "RD〜OP",
    scaleMonths: 18,
  },
  {
    id: "fintech-core",
    no: 3,
    industry: "Finance",
    title: "金融基幹システム刷新",
    summary:
      "オンプレ COBOL 基幹を Java + Spring に段階移行。並行運用設計・データ整合性検証を主導。",
    roles: ["PM", "SE"],
    os: ["Linux", "AIX"],
    db: ["Oracle", "DB2"],
    stack: ["Java", "Spring"],
    start: "2019/04",
    end: "2021/09",
    phase: "RD〜ST",
    scaleMonths: 96,
  },
  {
    id: "ec-platform",
    no: 4,
    industry: "Retail / EC",
    title: "EC プラットフォーム新設",
    summary:
      "Laravel + Vue で構築した B2C EC。決済連携、注文管理、在庫同期、運用 ops までを内製化。",
    roles: ["PL", "SE", "PG"],
    os: ["AWS"],
    db: ["MySQL"],
    stack: ["PHP", "JavaScript", "TypeScript"],
    start: "2022/01",
    end: "2023/02",
    phase: "RD〜OP",
    scaleMonths: 38,
  },
];

export const ROLE_LABEL: Record<Role, string> = {
  PM: "Project Manager",
  PL: "Project Leader",
  SE: "System Engineer",
  PG: "Programmer",
};
