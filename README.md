# yanahiro / Portfolio v2

Hiroki Yanagisawa (柳澤 宏樹) のポートフォリオサイト。
文字は最小限にとどめ、1枚の WebGL キャンバス上の粒子が、スクロールに合わせて形を変えていく構成です。

## ✨ Features

- **Particle stage**
  - 画面に固定した WebGL キャンバス1枚を全セクションで共有（three.js + 自作 GLSL シェーダー）
  - ロゴ SVG・写真・文字からピクセルを抽出し、粒子の目標座標に変換
  - スクロール位置に応じて形を補間。カーソルで粒子が散り、ドラッグで立体的に回る
  - three.js は遅延読み込み。WebGL が使えない環境では静的な表示にフォールバック
- **Sections**
  - Top: 粒子が Yanatch ロゴを形づくる
  - Career: ピン留めした1画面の中で、粒子が経歴5シーンの形に組み替わる
  - About: 写真を粒子で描画（ホバーで実写に切り替え）+ 行単位のテキストリビール
  - Skills: ロゴが物理演算で漂い、掴んで投げられる。カテゴリで絞り込み
  - Contact: 粒子が「Say hello.」の文字を形づくる
- **Interactions**
  - Lenis スムーススクロール（ページ内アンカー対応）
  - マグネティックホバー（SNS リンク）

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: GSAP 3 (ScrollTrigger / SplitText / @gsap/react) + Lenis
- **WebGL**: three.js + GLSL
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
| `NEXT_PUBLIC_SITE_URL` | 公開 URL（OG 画像の絶対 URL 生成に使用） |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | meta description |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager のコンテナ ID（`GTM-XXXXXXX`）。空なら読み込まない。Google Analytics は GTM 側のタグで設定する |
| `NEXT_PUBLIC_X_HANDLE` | X (Twitter) ハンドル |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub プロフィール URL |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram プロフィール URL |
| `NEXT_PUBLIC_FACEBOOK_URL` | Facebook プロフィール URL |

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout（フォント / SmoothScroll）
│   ├── page.tsx              # 全セクション統合
│   ├── opengraph-image.tsx   # OG 画像生成
│   └── globals.css           # Tailwind v4 theme + base
├── components/
│   ├── particles/
│   │   ├── ParticleStage.tsx      # 固定キャンバスと描画ループ
│   │   ├── ParticleStageLazy.tsx  # three.js の遅延読み込み
│   │   └── shaders.ts             # 頂点 / フラグメントシェーダー
│   ├── skills/LogoPlayground.tsx  # ロゴの物理演算フィールド
│   ├── Hero / Career / About / Skills / Contact.tsx
│   ├── Header / BrandLogo / Magnetic / RevealLines / SmoothScroll.tsx
├── data/                     # career（5シーン）/ skills（ロゴ一覧）
└── lib/
    ├── particles/
    │   ├── sampleShapes.ts   # SVG・画像・文字 → 粒子座標
    │   └── scenes.ts         # スクロール区間と形の対応表
    ├── physics.ts            # 円の衝突・ばね・壁
    ├── gsap.ts               # GSAP プラグイン登録
    ├── config.ts             # 環境変数集約
    └── useMagnetic.ts        # マグネティックホバー hook
```

## 📦 Build & Deploy

```bash
npm run build       # production build
npm start           # production server
```

Vercel / Cloudflare Pages 等の静的デプロイに対応。

## 🎨 Accessibility

`prefers-reduced-motion: reduce` を尊重しています。
粒子は移動せずクロスフェードで切り替わり、スムーススクロール・行リビール・ロゴの漂いは停止します。

## 📜 License

Personal portfolio. Source code is published for transparency / reference. Content (text / images / brand) © Hiroki Yanagisawa.
