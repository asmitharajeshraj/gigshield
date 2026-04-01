/**
 * GigShield Dynamic Premium Calculation Engine
 * Parametric pricing based on real-world risk factors.
 * All premiums in ₹/week.
 */

export type Tier = 'bronze' | 'silver' | 'gold';
export type Season = 'monsoon' | 'summer' | 'winter' | 'normal';
export type AQIZone = 'low' | 'moderate' | 'high' | 'severe';

export interface PremiumInputFactors {
  city: string;
  platform: 'zomato' | 'swiggy';
  hoursPerDay: number;        // 1–16
  experienceYears: number;    // 0–10
  season: Season;
  aqiZone: AQIZone;
  floodRisk: boolean;
  hasAccidentHistory: boolean;
  hospitalCashAddOn: boolean; // +₹18/wk
  accidentCoverAddOn: boolean;// +₹28/wk
  loyaltyWeeks: number;       // consecutive claim-free weeks
}

export interface BreakdownLine {
  label: string;
  amount: number;
  type: 'add' | 'subtract' | 'base';
  reason?: string;
}

export interface PremiumResult {
  basePremium: number;
  finalPremium: number;
  breakdown: BreakdownLine[];
  maxPayoutPerDay: number;
  savingsVsIndustry: number;  // how much cheaper than traditional insurance
  triggerThresholds: TriggerThreshold[];
}

export interface TriggerThreshold {
  icon: string;
  event: string;
  threshold: string;
  payout: string;
  active: boolean;
}

// ── Base tables ────────────────────────────────────────────────────────────────
const BASE_PREMIUMS: Record<Tier, number> = { bronze: 29, silver: 59, gold: 99 };
const MAX_PAYOUTS: Record<Tier, number> = { bronze: 1200, silver: 2500, gold: 4000 };

const CITY_RISK_PCTS: Record<string, number> = {
  Chennai: 0.18, Mumbai: 0.22, Delhi: 0.12, Bangalore: 0.08,
  Hyderabad: 0.10, Kolkata: 0.14, Pune: 0.09, Ahmedabad: 0.07,
  Surat: 0.11,    Jaipur: 0.06, Lucknow: 0.09, Bhopal: 0.07,
};

const SEASON_PCTS: Record<Season, number> = {
  monsoon: 0.20, summer: 0.10, winter: 0.00, normal: 0.00,
};

const AQI_PCTS: Record<AQIZone, number> = {
  severe: 0.15, high: 0.10, moderate: 0.05, low: 0.00,
};

const TRIGGER_TIERS: Record<Tier, TriggerThreshold[]> = {
  bronze: [
    { icon: '🌧️', event: 'Heavy Rain', threshold: '>35 mm/hr (IMD)', payout: '₹1,200/day', active: true },
    { icon: '💨', event: 'Severe AQI', threshold: '>300 (CPCB)', payout: '₹1,200/day', active: true },
    { icon: '🚫', event: 'Curfew / Sec 144', threshold: 'Govt notification', payout: '₹1,200/day', active: true },
    { icon: '📱', event: 'Platform Outage', threshold: '>4 hrs downtime', payout: 'Not covered', active: false },
    { icon: '🌡️', event: 'Heatwave', threshold: '>44°C (IMD)', payout: 'Not covered', active: false },
  ],
  silver: [
    { icon: '🌧️', event: 'Heavy Rain', threshold: '>25 mm/hr (IMD)', payout: '₹2,500/day', active: true },
    { icon: '💨', event: 'Severe AQI', threshold: '>200 (CPCB)', payout: '₹2,500/day', active: true },
    { icon: '🚫', event: 'Curfew / Sec 144', threshold: 'Govt notification', payout: '₹2,500/day', active: true },
    { icon: '📱', event: 'Platform Outage', threshold: '>2 hrs downtime', payout: '₹2,500/day', active: true },
    { icon: '🌡️', event: 'Heatwave', threshold: '>43°C (IMD)', payout: 'Not covered', active: false },
  ],
  gold: [
    { icon: '🌧️', event: 'Heavy Rain', threshold: '>15 mm/hr (IMD)', payout: '₹4,000/day', active: true },
    { icon: '💨', event: 'Severe AQI', threshold: '>150 (CPCB)', payout: '₹4,000/day', active: true },
    { icon: '🚫', event: 'Curfew / Sec 144', threshold: 'Govt notification', payout: '₹4,000/day', active: true },
    { icon: '📱', event: 'Platform Outage', threshold: '>1 hr downtime', payout: '₹4,000/day', active: true },
    { icon: '🌡️', event: 'Heatwave', threshold: '>42°C (IMD)', payout: '₹4,000/day', active: true },
  ],
};

// ── Core calculation function ───────────────────────────────────────────────────
export function calculatePremium(
  tier: Tier,
  factors: PremiumInputFactors
): PremiumResult {
  const base = BASE_PREMIUMS[tier];
  const breakdown: BreakdownLine[] = [];

  breakdown.push({ label: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Shield Base`, amount: base, type: 'base' });

  // City risk
  const cityPct = CITY_RISK_PCTS[factors.city] ?? 0.10;
  const cityAdj = Math.round(base * cityPct);
  if (cityAdj > 0) {
    breakdown.push({
      label: `${factors.city} Risk Zone (+${Math.round(cityPct * 100)}%)`,
      amount: cityAdj, type: 'add',
      reason: 'Based on historical IMD weather data and claim frequency',
    });
  }

  // Season
  const seasonPct = SEASON_PCTS[factors.season];
  const seasonAdj = Math.round(base * seasonPct);
  if (seasonAdj > 0) {
    breakdown.push({
      label: `${factors.season.charAt(0).toUpperCase() + factors.season.slice(1)} Season Surcharge`,
      amount: seasonAdj, type: 'add',
      reason: 'Elevated trigger probability during this season',
    });
  }

  // AQI zone
  const aqiPct = AQI_PCTS[factors.aqiZone];
  const aqiAdj = Math.round(base * aqiPct);
  if (aqiAdj > 0) {
    breakdown.push({
      label: `AQI Zone: ${factors.aqiZone.charAt(0).toUpperCase() + factors.aqiZone.slice(1)}`,
      amount: aqiAdj, type: 'add',
      reason: 'Historical AQI levels in your pincode area',
    });
  }

  // Flood risk flag
  const floodAdj = factors.floodRisk ? Math.round(base * 0.10) : 0;
  if (floodAdj > 0) {
    breakdown.push({
      label: 'Flood-Prone Zone',
      amount: floodAdj, type: 'add',
      reason: 'Your pincode is mapped to a NDMA flood-prone zone',
    });
  }

  // Work hours
  let hoursAdj = 0;
  if (factors.hoursPerDay > 10) {
    hoursAdj = Math.round(base * 0.10);
    breakdown.push({ label: `Long Hours (${factors.hoursPerDay}h/day)`, amount: hoursAdj, type: 'add', reason: 'Extended exposure time increases trigger probability' });
  } else if (factors.hoursPerDay >= 8) {
    hoursAdj = Math.round(base * 0.05);
    breakdown.push({ label: `Work Hours (${factors.hoursPerDay}h/day)`, amount: hoursAdj, type: 'add', reason: 'Above-average active hours' });
  }

  // Experience — new riders cost more, veterans get slight discount
  let expAdj = 0;
  if (factors.experienceYears < 1) {
    expAdj = Math.round(base * 0.20);
    breakdown.push({ label: 'New Rider Surcharge (<1 yr)', amount: expAdj, type: 'add', reason: 'Higher incident rate for riders <1 year experience' });
  } else if (factors.experienceYears < 3) {
    expAdj = Math.round(base * 0.10);
    breakdown.push({ label: 'Rider Experience Adjustment', amount: expAdj, type: 'add', reason: 'Moderate experience level' });
  } else if (factors.experienceYears >= 5) {
    expAdj = -Math.round(base * 0.05);
    breakdown.push({ label: 'Veteran Rider Discount (5+ yrs)', amount: Math.abs(expAdj), type: 'subtract', reason: 'Lower incident history for experienced riders' });
  }

  // Accident history
  const accidentAdj = factors.hasAccidentHistory ? Math.round(base * 0.15) : 0;
  if (accidentAdj > 0) {
    breakdown.push({ label: 'Accident History Loading', amount: accidentAdj, type: 'add', reason: 'Prior incident increases risk profile' });
  }

  // Add-ons
  if (factors.hospitalCashAddOn) {
    breakdown.push({ label: 'Hospital Cash Cover Add-on', amount: 18, type: 'add', reason: '₹500/day for hospitalisation up to 30 days' });
  }
  if (factors.accidentCoverAddOn) {
    breakdown.push({ label: 'PA Accident Cover Add-on', amount: 28, type: 'add', reason: '₹2,00,000 personal accident cover' });
  }

  // Loyalty discount (up to 15% for 12+ claim-free weeks)
  const loyaltyTiers = Math.min(Math.floor(factors.loyaltyWeeks / 4), 3);
  const loyaltyPct = loyaltyTiers * 0.05;
  const loyaltyDiscount = loyaltyTiers > 0 ? -Math.round(base * loyaltyPct) : 0;
  if (loyaltyDiscount < 0) {
    breakdown.push({
      label: `Loyalty Discount (${factors.loyaltyWeeks} claim-free weeks)`,
      amount: Math.abs(loyaltyDiscount), type: 'subtract',
      reason: `${Math.round(loyaltyPct * 100)}% discount for claim-free streak`,
    });
  }

  const adds = breakdown.filter(b => b.type !== 'subtract').reduce((s, b) => s + b.amount, 0);
  const subs = breakdown.filter(b => b.type === 'subtract').reduce((s, b) => s + b.amount, 0);
  const finalPremium = Math.max(adds - subs, Math.round(base * 0.75)); // floor at 75% of base

  return {
    basePremium: base,
    finalPremium,
    breakdown,
    maxPayoutPerDay: MAX_PAYOUTS[tier],
    savingsVsIndustry: Math.round(finalPremium * 18), // avg traditional = 18x
    triggerThresholds: TRIGGER_TIERS[tier],
  };
}

// ── Compare all tiers ──────────────────────────────────────────────────────────
export function compareAllTiers(factors: PremiumInputFactors): Record<Tier, PremiumResult> {
  return {
    bronze: calculatePremium('bronze', factors),
    silver: calculatePremium('silver', factors),
    gold: calculatePremium('gold', factors),
  };
}
