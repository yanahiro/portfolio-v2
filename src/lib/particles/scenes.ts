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
  /** How long the shape stays formed on each side of its position, in viewport heights. */
  hold: number;
  /** "cover" fills the slot instead of fitting inside it. */
  fit?: "cover";
  /** Two colours the shape blends between, left to right, instead of the foreground colour. */
  gradient?: [string, string];
  /** 1 = the colour slowly cycles through the palette in the vertex shader. */
  cycle?: number;
  /** How much the shape swells and shrinks over time, as a share of its size. */
  pulse?: number;
};

export const CAREER_TRIGGER_ID = "career";
export const CAREER_SLOT = '[data-slot="career"]';

/** Scroll distance of the pinned career section, in viewport heights. */
export const CAREER_PIN_LENGTH = 6.5;
/** How long a career shape stays formed on each side of its key, in viewport heights. */
const CAREER_HOLD = 0.36;
/** How far inside a hold the page comes to rest after scrolling stops mid-morph, in viewport heights. */
const REST_INSET = 0.1;
/** Share of a morph that has to be scrolled through before the page carries on to the next shape. */
const REST_COMMIT = 0.3;

/** Career shapes, spread evenly over the pinned scroll distance. */
const CAREER_SHAPES: { shape: ShapeId; accent?: number; size?: number; pulse?: number; gradient?: [string, string] }[] = [
  { shape: "prompt" },
  { shape: "helloWorld" },
  { shape: "ball" },
  // Design: violet into coral. Joining a team: aqua into the lime that "now" glows in.
  { shape: "curves", gradient: ["#ad94ff", "#ff8f66"] },
  { shape: "clusters", gradient: ["#4debff", "#b6ff3c"] },
  { shape: "glow", accent: 1, size: 2.2, pulse: 0.05 },
];
const CAREER_STEP = 1 / (CAREER_SHAPES.length - 1);

/** Career progress thresholds at which the caption switches to the next scene (mid-morph). */
const SCENE_BREAKS = [1.5, 2.5, 3.5, 4.5].map((k) => k * CAREER_STEP);

export function careerScene(progress: number): number {
  let scene = 0;
  for (const b of SCENE_BREAKS) if (progress >= b) scene += 1;
  return scene;
}

/**
 * Where the page should come to rest when scrolling stops between two career
 * shapes: just inside the hold of the one being scrolled towards. Offsets are
 * px into the pinned distance. Null when a shape is already formed.
 */
export function careerRestOffset(
  offset: number,
  length: number,
  viewportHeight: number,
  /** 1 = scrolling down, -1 = up. */
  direction: number,
): number | null {
  if (offset <= 0 || offset >= length) return null;
  const step = length * CAREER_STEP;
  const hold = CAREER_HOLD * viewportHeight;
  const index = Math.min(Math.floor(offset / step), CAREER_SHAPES.length - 2);
  const morphStart = index * step + hold;
  const morphEnd = (index + 1) * step - hold;
  if (morphEnd <= morphStart || offset <= morphStart || offset >= morphEnd) return null;

  const done = (offset - morphStart) / (morphEnd - morphStart);
  const forward = direction >= 0 ? done > REST_COMMIT : done > 1 - REST_COMMIT;
  const inset = Math.min(REST_INSET * viewportHeight, hold);
  return forward ? morphEnd + inset : morphStart - inset;
}

export const STOPS: Stop[] = [
  { shape: "logo", slot: '[data-slot="hero"]', at: { kind: "top" }, hold: 0.2, alpha: 0.9, size: 1.7, accent: 0 },
  ...CAREER_SHAPES.map(
    (k, i): Stop => ({
      shape: k.shape,
      slot: CAREER_SLOT,
      at: { kind: "career", p: i * CAREER_STEP },
      hold: CAREER_HOLD,
      alpha: 0.95,
      size: k.size ?? 1.7,
      accent: k.accent ?? 0,
      pulse: k.pulse,
      gradient: k.gradient,
    }),
  ),
  { shape: "photo", slot: '[data-slot="photo"]', at: { kind: "center" }, hold: 0.3, alpha: 0.95, size: 1.8, accent: 0 },
  { shape: "dust", slot: '[data-slot="skills"]', at: { kind: "center" }, hold: 0.2, alpha: 0.3, size: 1.5, accent: 0, fit: "cover" },
  { shape: "hello", slot: '[data-slot="hello"]', at: { kind: "center" }, hold: 0.2, alpha: 1, size: 1.7, accent: 0, cycle: 1 },
];
