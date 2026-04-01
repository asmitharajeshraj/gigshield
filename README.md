# 🛡️ GigShield

> **Parametric Zero-Touch Insurance for Gig Delivery Workers**  
> Built for the **Guidewire DEVTrails 2026 Hackathon**

GigShield is a Progressive Web App (PWA) that provides affordable, instant-payout insurance to Zomato and Swiggy delivery partners in India. Payouts are **automatically triggered** by verified real-world events — heavy rain, AQI spikes, platform outages, curfews, and heatwaves — with **zero claim forms** required.

---

## 📸 Screenshots

| Mobile App (360×800) | Admin Dashboard (1440×1024) |
|---|---|
| Sign In → KYC → Plans → Dashboard | Fraud Detection · Analytics · Payouts |

---

## ✨ Features

### 📱 Mobile PWA (Delivery Partner)
| Screen | Description |
|--------|-------------|
| **Sign In** | Phone + OTP authentication with Hindi/Tamil language toggle |
| **KYC Setup** | Worker ID, UPI ID, city, pincode, platform (Zomato/Swiggy) |
| **Plan Selection** | Tier cards: Bronze ₹29 · Silver ₹59 · Gold ₹115/week |
| **Dashboard** | Live trigger monitoring (rain, AQI, temp, platform status) |
| **Alert Screen** | Real-time parametric event notifications with payout preview |
| **Payout Screen** | Zero-touch payout confirmation with UPI deep-link |
| **Claims History** | Full ledger of past claims with status badges |
| **Notifications** | Push alert feed for events and policy updates |
| **Profile** | Loyalty tier progress, referral code, earnings summary |

### 🖥️ Admin Dashboard (Insurer / Operations)
| Section | Description |
|---------|-------------|
| **Overview** | Total policies, active claims, payout volume, trigger events |
| **Fraud Detection** | ML anomaly scores, risk heatmaps, flagged transactions |
| **Analytics** | City-wise coverage charts, plan distribution, weekly trends |
| **Payout Queue** | Bulk approve/reject parametric payouts |

### 🔔 Parametric Triggers
| Trigger | Source | Threshold |
|---------|--------|-----------|
| Heavy Rain | IMD API | > 15 mm/hr |
| Severe AQI | CPCB / IQAir | > 200 (Very Poor) |
| Extreme Heat | IMD API | > 42°C |
| Platform Outage | Zomato/Swiggy Status | Downtime > 30 min |
| Section 144 / Curfew | Government Alerts | Active notification |

### 💎 Loyalty & Referral
- **GigShield Points** earned per claim-free week
- Tier progression: Bronze → Silver → Gold Shield
- Referral code system with ₹29 credit on successful signup

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Routing | React Router v7 (Data Mode) |
| Styling | Tailwind CSS v4 |
| Animation | Motion (Framer Motion successor) |
| UI Primitives | Radix UI |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Context API |
| Build | Vite 6 |
| PWA | Custom Service Worker + Web App Manifest |
| Font | Inter (Google Fonts) + Noto Sans Devanagari (Hindi) |

---

## 📂 Project Structure

```
gigshield/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker (offline + push notifications)
│   └── icons/                 # PWA icons (72px – 512px) ← add your own
│
├── src/
│   ├── app/
│   │   ├── App.tsx                        # Root with RouterProvider
│   │   ├── routes.ts                      # All route definitions
│   │   ├── context/
│   │   │   └── AppContext.tsx             # Global state (user, tier, claims)
│   │   └── components/
│   │       ├── screens/                   # Mobile screens
│   │       │   ├── SignIn.tsx
│   │       │   ├── KYCSetup.tsx
│   │       │   ├── PremiumSelect.tsx
│   │       │   ├── Dashboard.tsx
│   │       │   ├── AlertScreen.tsx
│   │       │   ├── PayoutScreen.tsx
│   │       │   ├── ClaimsHistory.tsx
│   │       │   ├── Notifications.tsx
│   │       │   └── Profile.tsx
│   │       ├── admin/                     # Desktop admin views
│   │       │   ├── AdminDashboard.tsx
│   │       │   └── FraudDetection.tsx
│   │       ├── layout/
│   │       │   └── MobileLayout.tsx       # Bottom nav shell
│   │       └── ui/                        # shadcn/ui component library
│   │
│   └── styles/
│       ├── index.css
│       ├── theme.css                      # Design tokens (deep purple #2E1065)
│       ├── fonts.css                      # Inter + Noto Sans Devanagari
│       └── tailwind.css
│
├── .gitignore
├── package.json
├── vite.config.ts
├── postcss.config.mjs
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- pnpm ≥ 8 (recommended) or npm / yarn

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/gigshield.git
cd gigshield

# 2. Install dependencies
pnpm install
# or: npm install

# 3. Start the development server
pnpm dev
# or: npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Build for Production

```bash
pnpm build
# or: npm run build

# Preview the production build
pnpm preview
```

---

## 🔗 Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | SignIn | Public |
| `/kyc` | KYCSetup | Post sign-in |
| `/premium` | PremiumSelect | Post KYC |
| `/app/dashboard` | Dashboard | Authenticated |
| `/app/alert` | AlertScreen | Authenticated |
| `/app/payout` | PayoutScreen | Authenticated |
| `/app/claims` | ClaimsHistory | Authenticated |
| `/app/alerts` | Notifications | Authenticated |
| `/app/profile` | Profile | Authenticated |
| `/admin` | AdminDashboard | Admin only |
| `/admin/fraud` | FraudDetection | Admin only |

---

## 🌐 PWA Installation

GigShield is a fully installable PWA:

1. Open the app in Chrome/Edge on Android
2. Tap the "Install" banner or use **⋮ → Add to Home Screen**
3. The app runs in standalone mode with offline support

For iOS (Safari): use **Share → Add to Home Screen**

---

## 🔒 Production Integration (Roadmap)

The current build uses **mock data** and simulated triggers for hackathon demonstration. For production:

| Feature | Integration Needed |
|---------|-------------------|
| OTP Authentication | Twilio / MSG91 / Firebase Auth |
| Trigger Data | IMD API · CPCB AQI API · Zomato/Swiggy Status APIs |
| UPI Payouts | Razorpay / PayU / NPCI UPI API |
| KYC Verification | DigiLocker / UIDAI Aadhaar OTP |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Database | Supabase / PostgreSQL |
| ML Fraud Detection | Python microservice (scikit-learn / XGBoost) |
| Policy Engine | Guidewire PolicyCenter API |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#2E1065` (Deep Purple) |
| Accent | `#7C3AED` (Violet 600) |
| Bronze | `#CD7F32` |
| Silver | `#9CA3AF` |
| Gold | `#F59E0B` |
| Font | Inter (Latin) + Noto Sans Devanagari (Hindi) |
| Mobile Frame | 360 × 800 px |
| Admin Frame | 1440 × 1024 px |

---

## 👥 Team

Built for **Guidewire DEVTrails 2026 Hackathon**

---

## 📄 License

MIT © 2026 GigShield Team

---

## 🙏 Acknowledgements

- [Guidewire](https://www.guidewire.com/) — Hackathon sponsor & insurance platform
- [Radix UI](https://www.radix-ui.com/) — Accessible component primitives
- [shadcn/ui](https://ui.shadcn.com/) — UI component library
- [Lucide](https://lucide.dev/) — Icon set
- [Recharts](https://recharts.org/) — Chart library
