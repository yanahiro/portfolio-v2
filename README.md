# yanahiro / Portfolio v2

Hiroki Yanagisawa (柳澤 宏樹) のポートフォリオサイト。
ダーク + ネオン基調のモダンデザインに、GSAP を中心としたインタラクションを多用しています。

10年前に作った旧ポートフォリオの世界観（流線・粒子・パララックス）を残しつつ、
2026 年現在のトレンド（Bento Grid / Smooth Scroll / 3D Particle Network / Pinned Horizontal Scroll 等）で再構築しています。

## ✨ Features

- **Hero**
  - three.js による Neural Particle Network（マウス追従の自転 + 粒子の脈動）
  - Loader: カウントアップ + ニューラルパルス + スリット退出
  - SplitText 風の名前アニメ + HUD 演出
- **Background ambience**
  - Streamlines（Canvas ベクトル場の流線）
  - Aurora Blobs（GSAP で漂う巨大グラデブロブ）
  - Neon Bubbles（控えめに浮上するネオン円 + 一部に Data Packet 文字）
- **Interactions**
  - Lenis スムーススクロール
  - カスタムカーソル（lerp 追従 + ホバー時にパーティクル trail）
  - マグネティックホバー（CTA / SNS）
  - Side progress nav（縦バー + ドット、`mix-blend-difference`）
  - Section splitter line / Header nav scramble
- **Sections**
  - About: パララックス写真 + Reveal mask
  - Strengths: Pinned Horizontal Scroll（デスクトップのみ）+ 3D tilt カード
  - Skills: スクロール速度連動の無限マーキー
  - Works: フィルタ + GSAP Flip + CountUp
  - Vision: 双方向ティッカー + kinetic typography
  - Contact: X DM 導線（メアドは公開しない設計）

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: GSAP 3 (ScrollTrigger / Flip) + Lenis
- **3D**: three.js
- **Build**: Turbopack

## 🚀 Getting Started

```bash
# 依存関係インストール
npm install

# 環境変数を用意
cp .env.example .env.local
# 必要に応じて .env.local を編集

# 開発サーバ
npm run dev
```

`http://localhost:3000` を開く。

## ⚙️ Configuration (環境変数)

`.env.example` を参考に `.env.local` を作成してください。

| 変数 | 用途 |
|---|---|
| `NEXT_PUBLIC_SITE_NAME` | サイト名 / ロゴ表記 |
| `NEXT_PUBLIC_BRAND` | ブランド名 |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | meta description |
| `NEXT_PUBLIC_X_HANDLE` | X (Twitter) ハンドル（DM導線に使用） |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub プロフィール URL |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram プロフィール URL |
| `NEXT_PUBLIC_FACEBOOK_URL` | Facebook プロフィール URL |

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout（Loader/Cursor/SmoothScroll）
│   ├── page.tsx          # 全セクション統合
│   └── globals.css       # Tailwind v4 theme + base
├── components/
│   ├── Hero.tsx                # FV
│   ├── NeuralNetwork.tsx       # three.js 粒子ネットワーク
│   ├── Loader.tsx              # 起動ローダー
│   ├── About / Strengths / Skills / Works / Vision / Contact.tsx
│   ├── Bubbles / AuroraBlobs / Streamlines.tsx  # 背景アニメ
│   ├── SmoothScroll / Cursor / SideProgress.tsx # 共通インタラクション
│   ├── Magnetic / Reveal / SectionSplitter / SectionHeading / CountUp.tsx
│   └── Header.tsx
├── data/                  # JSON 駆動データ（works / skills）
└── lib/
    ├── gsap.ts           # GSAP プラグイン登録
    ├── config.ts         # 環境変数集約
    └── useMagnetic.ts    # マグネティックホバー hook
```

## 📦 Build & Deploy

```bash
npm run build       # production build
npm start           # production server
```

Vercel / Cloudflare Pages 等の静的デプロイに対応。

## 🎨 Accessibility

`prefers-reduced-motion: reduce` を尊重しています。
全アニメーションが短縮 / 停止 / 静的化されます。

## 📜 License

Personal portfolio. Source code is published for transparency / reference. Content (text / images / brand) © Hiroki Yanagisawa.
