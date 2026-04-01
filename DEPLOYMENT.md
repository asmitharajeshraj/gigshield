# GigShield — Deployment Guide

## Quick Deploy Options

### 1. GitHub Pages (Free — Recommended for Demo)

The CI workflow (`.github/workflows/ci.yml`) auto-deploys to GitHub Pages on every push to `main`.

**One-time setup:**
1. Go to your repo → **Settings → Pages**
2. Source: **GitHub Actions**
3. Push to `main` — the app will be live at `https://YOUR_USERNAME.github.io/gigshield/`

If deploying to a subdirectory, update `vite.config.ts`:
```ts
export default defineConfig({
  base: '/gigshield/',   // Add this line
  // ...rest of config
})
```

---

### 2. Vercel (Zero-config)

```bash
npm i -g vercel
vercel --prod
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for auto-deployments.

---

### 3. Netlify

```bash
npm i -g netlify-cli
netlify deploy --dir=dist --prod
```

Create a `netlify.toml` for SPA routing:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 4. Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`nginx.conf`:
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
docker build -t gigshield .
docker run -p 3000:80 gigshield
```

---

## Environment Variables

For production integrations, create a `.env` file (never commit this!):

```env
# OTP / Auth
VITE_TWILIO_ACCOUNT_SID=your_twilio_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_token

# Payout
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx

# Weather / AQI Triggers
VITE_IMD_API_KEY=your_imd_key
VITE_IQAIR_API_KEY=your_iqair_key

# Push Notifications
VITE_FCM_VAPID_KEY=your_fcm_vapid_key

# Supabase (if connected)
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

In React, access as: `import.meta.env.VITE_RAZORPAY_KEY_ID`

---

## PWA Icons

Place icon files in `/public/icons/`:
```
icon-72x72.png
icon-96x96.png
icon-128x128.png
icon-144x144.png
icon-152x152.png
icon-192x192.png
icon-384x384.png
icon-512x512.png
```

Generate all sizes from a single 1024×1024 PNG using:
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator): `npx pwa-asset-generator logo.png ./public/icons`
- [RealFaviconGenerator](https://realfavicongenerator.net/)

---

## Admin Access

The admin dashboard is available at `/admin` (no auth gate in demo mode).  
For production, add a role-based auth check in `AdminDashboard.tsx`.

**Demo admin credentials (mock):** Any login → navigate to `/admin` manually.
