# 🖼️ Image Background Remover

Remove image backgrounds instantly using Next.js + Tailwind CSS + Remove.bg API

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **API**: Remove.bg
- **Deployment**: Vercel / Cloudflare Pages

## 📦 Installation

```bash
# Install dependencies
npm install

# Set environment variable
cp .env.local .env
# Edit .env and add your REMOVE_BG_API_KEY
```

## 🐣 Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variable
vercel env add REMOVE_BG_API_KEY

# Deploy
vercel --prod
```

Or connect your GitHub repo to Vercel and add the environment variable in the dashboard.

### Cloudflare Pages

```bash
# Install wrangler
npm install -g wrangler

# Build for Cloudflare
npm run build

# Deploy
wrangler pages deploy .output
```

## 🔑 Get Remove.bg API Key

1. Sign up at https://www.remove.bg/api
2. Free tier: 50 credits/month

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── remove-bg/
│   │       └── route.ts      # API endpoint
│   ├── globals.css           # Tailwind styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── public/                   # Static files
├── .env.local               # Local env vars
├── next.config.js           # Next.js config
├── tailwind.config.js       # Tailwind config
└── package.json
```

## ✅ Features

- ✨ Drag & drop upload
- ✨ Instant background removal
- ✨ Side-by-side preview
- ✨ One-click download
- ✨ No storage needed
- ✨ Beautiful UI with Tailwind

## 📄 License

MIT
