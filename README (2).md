# 🛡️ GigShield — Parametric Income Insurance for Food Delivery Partners

> **Guidewire DEVTrails 2026** | Persona: Zomato & Swiggy Delivery Partners | Platform: PWA (Mobile-first)

---

## The Problem

India's 5M+ food delivery partners lose **₹1,500–₹3,500/week** during weather shutdowns, heatwaves, and civic disruptions — with zero income protection. When Zomato suspends deliveries during a flood, workers earn ₹0. Their bills don't care.

**GigShield** monitors real-world disruptions and automatically pays workers — no claim forms, no waiting.

---

## How It Works

```
Worker Onboards → Weekly Policy Activated → Disruption Detected (AI) → Auto Payout to UPI
```

When rainfall exceeds 50mm in a worker's zone, GigShield detects it, validates the policy, checks for fraud, and sends money — before the worker even opens the app.

---

## Weekly Premium Model

| Plan | Weekly Premium | Max Payout | Coverage |
|---|---|---|---|
| 🥉 Bronze | ₹29/week | ₹1,200 | Up to 2 disrupted days |
| 🥈 Silver | ₹59/week | ₹2,500 | Up to 4 disrupted days |
| 🥇 Gold | ₹99/week | ₹4,000 | Up to 6 disrupted days |

**Why weekly?** Delivery partners earn and get platform settlements every 7 days. Monthly premiums create a cash-flow mismatch. Weekly doesn't.

**AI adjusts the premium every Monday** based on zone flood history, seasonal risk, worker tenure, and the IMD 7-day forecast. Workers see a plain-language breakdown before any debit.

---

## Parametric Triggers (5 Automated)

| # | Trigger | API Source | Threshold |
|---|---|---|---|
| 1 | Heavy Rain | OpenWeatherMap + IMD | >50mm in 6 hours |
| 2 | Extreme Heat | NDMA Alert + OpenWeatherMap | Feels-like >44°C + Red Alert |
| 3 | Severe AQI | CPCB AQI API | AQI >400 for 4+ hours |
| 4 | Bandh / Curfew | Govt RSS + News API (mock) | Official pincode-level shutdown |
| 5 | Platform Outage | Simulated Zomato/Swiggy API | >80% order failure rate for 2hrs |

**Note:** We insure lost income only. No vehicle repair, health, life, or accident coverage.

---

## AI/ML Integration

- **Risk Profiling** — XGBoost model scores each worker's pincode risk at onboarding (flood history, weather patterns, civic disruption frequency)
- **Dynamic Pricing** — Linear regression + rule engine personalizes the weekly premium
- **Fraud Detection** — Isolation Forest anomaly detection + rule layer (GPS activity during claimed disruption, duplicate device fingerprints, claim timing anomalies, GPS spoofing via accelerometer patterns)

---

## 🔐 Adversarial Defense & Anti-Spoofing Strategy

Fraud in parametric insurance is a real attack surface. Since payouts trigger automatically on data thresholds, bad actors may attempt to spoof GPS, fake disruptions, or coordinate mass false claims. GigShield has a dedicated, multi-layered defense strategy built around one core idea:

> **We verify reality — not just location.**

It is possible to fake a GPS coordinate. But a real-world disruption leaves a messy, multi-signal footprint — human behaviour, network instability, physical movement, sensor noise. Our system looks for that natural chaos. An environment that is too clean, too scripted, or too still is the red flag.

We don't ask *"Is this location real?"* — we ask *"Does this situation behave like real life?"*

### 1. Signal-Level Defenses

#### 1A. Chaos Signature Model

A fraudster sitting at home has a stable, low-noise environment. A real delivery partner caught in extreme weather produces a noisy, imperfect one. We exploit this gap.

We calculate a **Chaos Score** — a measure of how messy and real a situation appears — using:

- **GPS drift** — minor, erratic variations are normal outdoors; suspiciously steady coordinates are not
- **Network instability** — unexpected latency spikes and signal drops consistent with adverse conditions
- **Sensor vibration** — small phone motions and bike vibrations captured via accelerometer
- **App behaviour** — stress-driven interactions like frantic refreshes or repeated app checks

When the environment is overly tidy and scripted, we flag it as likely spoofed.

#### 1B. Movement Authenticity

Rather than checking *where* someone is, we check *how they got there*.

- **Continuous path validation** — teleportation jumps are rejected outright
- **Speed consistency** — movement must be within physically plausible bike limits
- **Micro-movement detection** — natural phone tilts and positional adjustments over time

#### 1C. Swarm / Group Fraud Detection

Coordinated attacks are treated as a single event, not individual claims.

We monitor:
- Volume of claims filed within a short time window
- Geographic clustering of claim origins
- Behavioural similarity across accounts

If hundreds of users simultaneously stop moving and all show suspiciously clean, identical data — the system flags it as a **Synthetic Cluster Event** and triggers a hold on that zone's payouts.

### 2. Data Strategy — Cheap but Hard to Fake

#### 2A. Motion Sensors

- **Accelerometer** — detects actual physical movement; a spoofed phone is often abnormally motionless
- **Gyroscope** — detects orientation changes consistent with riding or walking

Even a phone sitting in a pocket generates continuous micro-noise. The absence of that noise is a signal.

#### 2B. Network Behaviour

We don't just check for internet connectivity — we monitor **latency patterns and signal fluctuations**. A worker genuinely caught in a storm will show network instability consistent with bad weather conditions.

#### 2C. Environmental Cross-Verification

We cross-reference:
- Reported weather severity vs. actual sensor readings
- User density in the claimed disruption area
- Behaviour of other trusted users in the same zone

If a zone is flagged as a flood area but nearby trusted users are moving normally, suspicion increases.

#### 2D. Temporal Behaviour Profiling

We track patterns over time:
- Does this user only go active during payout windows?
- Do they repeatedly claim in high-risk zones while remaining dormant otherwise?
- Is there a consistent discrepancy between claimed disruption and historical patterns?

### 3. UX Strategy — Protect Real Workers First

We never punish instantly. A genuine worker in distress can face signal loss, fear, and confusion. Premature rejection damages trust.

#### 3A. No Instant Rejection

Instead of hard rejections, the system shows: *"Verification in progress due to unusual conditions."* The worker isn't penalised while we gather more signal.

#### 3B. Tiered Payout System

| Confidence Level | Action |
|---|---|
| High | Instant payout |
| Medium | Short delay, queued for background check |
| Low | Held for manual or ML review |

#### 3C. Quiet Background Verification

Without interrupting the user, the system silently monitors:
- Continuity of motion in subsequent minutes
- Network stabilisation or degradation
- Sensor data consistency

If everything normalises and matches disruption expectations, the payout releases automatically.

#### 3D. Reputation Layers

- Long-standing, verified delivery partners with clean histories receive **faster approvals**
- New or flagged accounts face **stricter verification thresholds**
- Trust accumulates over time — reliable workers are rewarded with less friction

### 4. Hard Defenses — Under Active Attack

If a coordinated attack is detected, the system enters a protective mode:

- **Rate limiting** — caps the number of payouts per zone within a time window
- **Claim cooldowns** — increases the minimum time between successive claims
- **Progressive verification hardening** — each successive suspicious claim in a zone raises the verification bar automatically

This ensures that even if attackers partially succeed, they cannot drain the system. The financial damage ceiling is bounded by design.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React PWA, Tailwind CSS, i18next (Hindi/Tamil) |
| Backend | Node.js + Express |
| ML Service | Python Flask + scikit-learn + XGBoost |
| Database | PostgreSQL + Redis |
| Payments | Razorpay test mode → UPI |
| Infra | Docker, GitHub Actions, AWS Free Tier |

**Why PWA over native app?** Delivery partners use low-end Android phones with limited storage. A PWA works on any device, needs no Play Store install, and can be shared via WhatsApp link.

---

## Repo Structure

```
gigshield/
├── frontend/        # React PWA (onboarding, dashboard, policy, claims)
├── backend/         # Node.js API (policy, triggers, payouts, fraud)
├── ml-service/      # Python Flask ML API (risk scoring, fraud detection)
├── mock-apis/       # Simulated weather, platform, civic alert feeds
└── docs/            # Architecture diagram, API spec, financial model
```

---

## Phase Roadmap

| Phase | Timeline | Focus |
|---|---|---|
| Phase 1 | Mar 4–20 | Ideation, architecture, ML prototype, mock APIs |
| Phase 2 | Mar 21–Apr 4 | Onboarding, policy engine, triggers, claims, payments |
| Phase 3 | Apr 5–17 | Fraud ML, dual dashboard, UPI simulator, pitch deck |

---

## Team

| Name | Role |
|---|---|
| [Name] | Product & Backend |
| [Name] | ML Engineer |
| [Name] | Frontend (React PWA) |
| [Name] | Data & Integrations |

📹 **Demo Video:** [Link to be added]

---

> *"They deliver your dinner. We protect their livelihood."*
