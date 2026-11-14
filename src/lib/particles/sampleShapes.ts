import type { ShapeId } from "./scenes";

/**
 * A particle target: `count` points in a box whose longer side spans [-1, 1],
 * a per-point brightness, and the width / height ratio of the occupied area.
 * A brightness of `BLINK + b` marks a particle of brightness `b` that blinks.
 */
export type Shape = {
  pos: Float32Array;
  bri: Float32Array;
  aspect: number;
  /** Present on text that is typed out one glyph at a time. */
  typing?: Typing;
};

/**
 * One entry per typing step, from nothing typed to everything typed, in the
 * shape's own x coordinates: `reveal` is how far the text is visible, and
 * `cursorShift` moves the blinking cursor back from its final place.
 */
export type Typing = { reveal: number[]; cursorShift: number[] };

/** A shape plus what is needed to map canvas pixels to its coordinates. */
type Sampled = Shape & { originX: number; pixelScale: number };

const LOGO_PATH =
  "M484.61 4.16A4.34 4.34 0 0 0 478.44.48L305 81.09a4.34 4.34 0 0 0-.3 7.72l38.48 21.61L238.91 272.67a5.87 5.87 0 0 1-9.93-.06L127.88 112.74a4.33 4.33 0 0 0-3.67-2H2.08A2.47 2.47 0 0 0 0 114.45L169.36 396.84a5.85 5.85 0 0 1 .84 3v186a5.87 5.87 0 0 0 5.87 5.87H291.71a5.87 5.87 0 0 0 5.87-5.87V400a5.85 5.85 0 0 1 1-3.24L449.28 170l39.61 22.25a4.35 4.35 0 0 0 6.47-4Z";
const LOGO_W = 496;
const LOGO_H = 592;

const DEPTH = 0.12;
/** Must match the threshold in the vertex shader. */
const BLINK = 2;

type PixelMode =
  /** Every opaque pixel, full brightness (vector art, text). */
  | "alpha"
  /** The whole image; density and brightness follow luminance (photos). */
  | "luma";

/** Luminance treated as full white when a photo is turned into particles. */
const PHOTO_WHITE = 0.6;

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2d canvas unavailable");
  return { canvas, ctx };
}

function fromPixels(
  image: ImageData,
  count: number,
  mode: PixelMode,
  /** Pixel area whose particles blink. */
  blinkArea?: { left: number; right: number; top: number; bottom: number },
): Sampled {
  const { width: w, height: h, data } = image;
  const cumulative = new Float32Array(w * h);
  const brightness = new Float32Array(w * h);
  let total = 0;
  let minX = w, maxX = 0, minY = h, maxY = 0;

  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
    const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    let weight = 0;
    let bri = 1;
    if (mode === "alpha") {
      weight = a > 128 ? 1 : 0;
    } else {
      // Push the contrast so dark areas empty out and the subject reads. Highlights are
      // clipped so skin is as dense as white clothing instead of fading beside it.
      const lit = Math.pow(Math.min(luma / PHOTO_WHITE, 1), 1.7);
      weight = 0.02 + lit;
      bri = 0.2 + 0.8 * lit;
    }
    if (weight > 0) {
      const x = i % w, y = (i / w) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    total += weight;
    cumulative[i] = total;
    brightness[i] = bri;
  }
  if (total === 0) throw new Error("shape has no drawable pixels");

  const boxW = maxX - minX + 1;
  const boxH = maxY - minY + 1;
  const cx = minX + boxW / 2;
  const cy = minY + boxH / 2;
  const scale = 2 / Math.max(boxW, boxH);

  const pos = new Float32Array(count * 3);
  const bri = new Float32Array(count);
  for (let p = 0; p < count; p++) {
    // Binary search for the pixel owning a random point of the cumulative weight.
    const target = Math.random() * total;
    let lo = 0, hi = w * h - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulative[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const x = (lo % w) + Math.random();
    const y = ((lo / w) | 0) + Math.random();
    pos[p * 3] = (x - cx) * scale;
    pos[p * 3 + 1] = -(y - cy) * scale;
    pos[p * 3 + 2] = (Math.random() - 0.5) * DEPTH;
    const column = lo % w;
    const row = (lo / w) | 0;
    const blinks =
      blinkArea &&
      column >= blinkArea.left &&
      column < blinkArea.right &&
      row >= blinkArea.top &&
      row < blinkArea.bottom;
    bri[p] = brightness[lo] + (blinks ? BLINK : 0);
  }
  return { pos, bri, aspect: boxW / boxH, originX: cx, pixelScale: scale };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load ${src}`));
    img.src = src;
  });
}

async function fromImage(src: string, count: number, mode: PixelMode, maxSide: number): Promise<Shape> {
  const img = await loadImage(src);
  const ratio = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * ratio));
  const h = Math.max(1, Math.round(img.naturalHeight * ratio));
  const { ctx } = makeCanvas(w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return fromPixels(ctx.getImageData(0, 0, w, h), count, mode);
}

function fromLogo(count: number): Shape {
  const scale = 0.6;
  const { ctx } = makeCanvas(Math.ceil(LOGO_W * scale), Math.ceil(LOGO_H * scale));
  ctx.scale(scale, scale);
  ctx.fillStyle = "#fff";
  ctx.fill(new Path2D(LOGO_PATH));
  return fromPixels(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height), count, "alpha");
}

const textFont = (fontFamily: string) => `500 200px ${fontFamily}`;

const LINE_HEIGHT = 250;

/** Rasterises `text` (lines separated by "\n", centred) and samples its pixels. */
function fromText(
  text: string,
  count: number,
  fontFamily: string,
  { glyphByGlyph = false, blinkLastGlyph = false } = {},
): Shape {
  const font = textFont(fontFamily);
  const probe = makeCanvas(8, 8).ctx;
  probe.font = font;
  // Drawing one glyph at a time keeps coding fonts from fusing sequences into ligatures.
  const lines = text.split("\n").map((line) => {
    const parts = glyphByGlyph ? Array.from(line) : [line];
    const advances = parts.map((part) => probe.measureText(part).width);
    return { parts, advances, width: advances.reduce((sum, a) => sum + a, 0) };
  });
  const width = Math.ceil(Math.max(...lines.map((l) => l.width))) + 40;
  const height = LINE_HEIGHT * lines.length + 50;
  const { ctx } = makeCanvas(width, height);
  ctx.font = font;
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  let blinkArea: { left: number; right: number; top: number; bottom: number } | undefined;
  lines.forEach((line, row) => {
    let x = (width - line.width) / 2;
    line.parts.forEach((part, i) => {
      ctx.fillText(part, x, 25 + LINE_HEIGHT * (row + 0.5));
      if (blinkLastGlyph && row === lines.length - 1 && i === line.parts.length - 1) {
        blinkArea = { left: Math.floor(x), right: width, top: 25 + LINE_HEIGHT * row, bottom: height };
      }
      x += line.advances[i];
    });
  });
  return fromPixels(ctx.getImageData(0, 0, width, height), count, "alpha", blinkArea);
}

/**
 * One line of text followed by a blinking cursor, typed out glyph by glyph.
 * The text is drawn in one piece (keeping its kerning); the steps come from
 * measuring how wide each prefix is.
 */
function fromTypedText(text: string, cursor: string, count: number, fontFamily: string): Shape {
  const font = textFont(fontFamily);
  const probe = makeCanvas(8, 8).ctx;
  probe.font = font;
  const glyphs = Array.from(text);
  const prefixes = glyphs.map((_, i) => probe.measureText(glyphs.slice(0, i + 1).join("")).width);
  const textWidth = prefixes[prefixes.length - 1];
  const left = 20;
  const width = Math.ceil(textWidth + probe.measureText(cursor).width) + left * 2;
  const height = LINE_HEIGHT + 50;
  const { ctx } = makeCanvas(width, height);
  ctx.font = font;
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.fillText(text, left, height / 2);
  ctx.fillText(cursor, left + textWidth, height / 2);

  const cursorLeft = Math.floor(left + textWidth);
  const shape = fromPixels(ctx.getImageData(0, 0, width, height), count, "alpha", {
    left: cursorLeft,
    right: width,
    top: 0,
    bottom: height,
  });
  const steps = [0, ...prefixes];
  return {
    pos: shape.pos,
    bri: shape.bri,
    aspect: shape.aspect,
    typing: {
      reveal: steps.map((w, i) => (i === 0 ? -10 : (left + w - shape.originX) * shape.pixelScale)),
      cursorShift: steps.map((w) => (w - textWidth) * shape.pixelScale),
    },
  };
}

/** Uniform point inside a sphere. */
function inSphere(radius: number): [number, number, number] {
  for (;;) {
    const x = Math.random() * 2 - 1, y = Math.random() * 2 - 1, z = Math.random() * 2 - 1;
    if (x * x + y * y + z * z <= 1) return [x * radius, y * radius, z * radius];
  }
}

function gaussian() {
  return (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;
}

function procedural(
  count: number,
  aspect: number,
  point: (i: number) => [number, number, number, number],
): Shape {
  const pos = new Float32Array(count * 3);
  const bri = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const [x, y, z, b] = point(i);
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
    bri[i] = b;
  }
  return { pos, bri, aspect };
}

/** A small, dense ball: one person leaving the crowd. */
const ball = (count: number) =>
  procedural(count, 1, () => {
    const [x, y, z] = inSphere(0.34);
    return [x, y, z, 0.6 + Math.random() * 0.4];
  });

/** Three flowing ribbons. */
const curves = (count: number) =>
  procedural(count, 1.5, (i) => {
    const ribbon = i % 3;
    const t = Math.random() * 2 - 1;
    const y =
      Math.sin(t * 2.7 + ribbon * 0.55) * 0.34 * (1 - ribbon * 0.12) +
      (ribbon - 1) * 0.16 +
      gaussian() * 0.035;
    return [t, y, gaussian() * 0.12, 0.5 + Math.random() * 0.5];
  });

/** Four groups trading particles with each other. */
const clusters = (count: number) => {
  const centers: [number, number][] = [
    [-0.52, 0.5],
    [0.52, 0.5],
    [-0.52, -0.5],
    [0.52, -0.5],
  ];
  return procedural(count, 1, (i) => {
    const [cx, cy] = centers[i % 4];
    if (Math.random() < 0.08) {
      // In transit between two groups.
      const [tx, ty] = centers[(i + 1 + ((Math.random() * 3) | 0)) % 4];
      const t = Math.random();
      return [cx + (tx - cx) * t + gaussian() * 0.02, cy + (ty - cy) * t + gaussian() * 0.02, 0, 0.45];
    }
    const [x, y, z] = inSphere(0.27);
    return [cx + x, cy + y, z, 0.55 + Math.random() * 0.45];
  });
};

/** Everything merged into one bright sphere: a hazy shell around a hot core. */
const glow = (count: number) =>
  procedural(count, 1, () => {
    if (Math.random() < 0.3) {
      return [gaussian() * 0.3, gaussian() * 0.3, gaussian() * 0.3, 1];
    }
    const [x, y, z] = inSphere(1);
    const len = Math.hypot(x, y, z) || 1;
    const r = 0.74 + gaussian() * 0.08;
    return [(x / len) * r, (y / len) * r, (z / len) * r, 0.5 + Math.random() * 0.5];
  });

/** A sparse field covering the whole slot. */
const dust = (count: number) =>
  procedural(count, 1, () => [
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    (Math.random() - 0.5) * 0.4,
    0.25 + Math.random() * 0.75,
  ]);

export async function buildShapes(
  count: number,
  displayFont: string,
  monoFont: string,
): Promise<Record<ShapeId, Shape>> {
  // Two lines keep the glyphs large enough to read as particles, also on phones.
  const code = { prompt: ">_", helloWorld: "Hello,\nWorld_" };
  const hello = { text: "Say hello.", cursor: "_" };
  const [photo] = await Promise.all([
    fromImage("/images/profile/portrait.webp", count, "luma", 420),
    // The canvas silently falls back to another face unless the web fonts are in memory first.
    document.fonts.load(textFont(displayFont), hello.text + hello.cursor).catch(() => []),
    document.fonts.load(textFont(monoFont), Object.values(code).join("")).catch(() => []),
  ]);
  return {
    logo: fromLogo(count),
    prompt: fromText(code.prompt, count, monoFont, { glyphByGlyph: true, blinkLastGlyph: true }),
    helloWorld: fromText(code.helloWorld, count, monoFont, { glyphByGlyph: true, blinkLastGlyph: true }),
    ball: ball(count),
    curves: curves(count),
    clusters: clusters(count),
    glow: glow(count),
    photo,
    dust: dust(count),
    hello: fromTypedText(hello.text, hello.cursor, count, displayFont),
  };
}
