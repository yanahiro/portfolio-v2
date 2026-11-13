export type ShapeId =
  | "logo"
  | "prompt"
  | "helloWorld"
  | "ball"
  | "curves"
  | "clusters"
  | "glow"
  | "photo"
  | "dust"
  | "hello";

/** Where on the page a shape is fully formed. */
export type StopAt =
  | { kind: "top" }
  /** The scroll position at which the slot element is vertically centred. */
  | { kind: "center" }
  /** A fraction of the pinned career section's scroll distance. */
  | { kind: "career"; p: number };

export type Stop = {
  shape: ShapeId;
  /** Selector of the DOM element the shape is drawn into. */
  slot: string;
  at: StopAt;
  alpha: number;
  /** Point size in CSS px. */
  size: number;
  /** 0 = foreground colour, 1 = accent colour. */
  accent: number;
  /** "cover" fills the slot instead of fitting inside it. */
  fit?: "cover";
  /** 1 = the colour slowly cycles through the palette in the vertex shader. */
  cycle?: number;
  /** How much the shape swells and shrinks over time, as a share of its size. */
  pulse?: number;
};

export const CAREER_TRIGGER_ID = "career";
export const CAREER_SLOT = '[data-slot="career"]';

/** Career progress at which each career shape is fully formed. */
const CAREER_KEYS: { shape: ShapeId; p: number; accent?: number; size?: number; pulse?: number }[] = [
  { shape: "prompt", p: 0 },
  { shape: "helloWorld", p: 0.26 },
  { shape: "ball", p: 0.52 },
  { shape: "curves", p: 0.68 },
  { shape: "clusters", p: 0.84 },
  { shape: "glow", p: 1, accent: 1, size: 2.2, pulse: 0.05 },
];

/** Career progress thresholds at which the caption switches to the next scene. */
const SCENE_BREAKS = [0.44, 0.6, 0.76, 0.92];

export function careerScene(progress: number): number {
  let scene = 0;
  for (const b of SCENE_BREAKS) if (progress >= b) scene += 1;
  return scene;
}

export const STOPS: Stop[] = [
  { shape: "logo", slot: '[data-slot="hero"]', at: { kind: "top" }, alpha: 0.9, size: 1.7, accent: 0 },
  ...CAREER_KEYS.map(
    (k): Stop => ({
      shape: k.shape,
      slot: CAREER_SLOT,
      at: { kind: "career", p: k.p },
      alpha: 0.95,
      size: k.size ?? 1.7,
      accent: k.accent ?? 0,
      pulse: k.pulse,
    }),
  ),
  { shape: "photo", slot: '[data-slot="photo"]', at: { kind: "center" }, alpha: 0.95, size: 1.8, accent: 0 },
  { shape: "dust", slot: '[data-slot="skills"]', at: { kind: "center" }, alpha: 0.3, size: 1.5, accent: 0, fit: "cover" },
  { shape: "hello", slot: '[data-slot="hello"]', at: { kind: "center" }, alpha: 1, size: 1.7, accent: 0, cycle: 1 },
];
