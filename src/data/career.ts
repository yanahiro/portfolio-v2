export type CareerScene = {
  /** When it happened. */
  when: string;
  /** The one line shown on screen. */
  line: string;
  /** Optional small caption under the line. */
  note?: string;
};

// One scene per step of the career; the particle shapes for each are in lib/particles/scenes.ts.
export const CAREER: CareerScene[] = [
  { when: "1社目 / SIベンダー", line: "ゼロから、書きはじめる。", note: ".NET · Java · PHP" },
  { when: "28歳", line: "フリーランスへ。" },
  { when: "30代前半", line: "デザインを学ぶ。", note: "大阪 → 東京" },
  { when: "ジョイン", line: "仲間と、世界と。" },
  { when: "NOW", line: "Wunderbar CTO" },
];
