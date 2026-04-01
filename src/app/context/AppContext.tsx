import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { PremiumInputFactors } from '../utils/premiumEngine';

// ── Interfaces ─────────────────────────────────────────────────────────────────

export interface UserProfile {
  phone: string;
  name: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  platform: 'zomato' | 'swiggy';
  workerId: string;
  aadhaarLast4: string;
  panNumber: string;
  riskScore: number;
  city: string;
  pincode: string;
  upiId: string;
  bankAccount: string;
  ifsc: string;
  totalEarnings: number;
  deliveries: number;
  memberSince: string;
  experienceYears: number;
  hoursPerDay: number;
  loyaltyPoints: number;
  referralCode: string;
  weeksSinceLastClaim: number;
}

export interface PolicyAddOn {
  id: string;
  name: string;
  description: string;
  weeklyPremium: number;
  active: boolean;
}

export interface Policy {
  id: string;
  policyNumber: string;
  tier: 'bronze' | 'silver' | 'gold';
  status: 'active' | 'expired' | 'cancelled' | 'paused';
  startDate: string;
  endDate: string;
  weeklyPremium: number;
  totalPremiumPaid: number;
  maxPayoutPerDay: number;
  addOns: PolicyAddOn[];
  autoRenew: boolean;
  weeksCovered: number;
  claimCount: number;
  lastRenewalDate: string;
}

export interface ClaimTimelineStep {
  time: string;
  label: string;
  icon: string;
  done: boolean;
}

export interface Claim {
  id: string;
  date: string;
  submittedAt: string;
  type: string;
  amount: number;
  status: 'paid' | 'processing' | 'rejected' | 'submitted' | 'under_review' | 'appealed';
  trigger: string;
  description?: string;
  timeline: ClaimTimelineStep[];
  appealReason?: string;
  documents?: string[];
  policyId?: string;
  isManual: boolean;
  zone?: string;
}

export type RegistrationStep = 'personal' | 'identity' | 'platform' | 'payment' | 'risk' | 'complete';

// ── Default premium factors ────────────────────────────────────────────────────

const defaultPremiumFactors: PremiumInputFactors = {
  city: 'Chennai',
  platform: 'zomato',
  hoursPerDay: 8,
  experienceYears: 2,
  season: 'monsoon',
  aqiZone: 'moderate',
  floodRisk: false,
  hasAccidentHistory: false,
  hospitalCashAddOn: false,
  accidentCoverAddOn: false,
  loyaltyWeeks: 0,
};

// ── Default data ───────────────────────────────────────────────────────────────

const defaultTimeline = (paid: boolean): ClaimTimelineStep[] => [
  { time: '14:23:01', label: 'Parametric trigger confirmed (IMD API)', icon: '📡', done: true },
  { time: '14:23:03', label: 'Location & pincode validated', icon: '📍', done: true },
  { time: '14:23:05', label: 'Platform work status verified', icon: '📱', done: true },
  { time: '14:23:07', label: 'ML fraud check passed (99.2% confidence)', icon: '🤖', done: true },
  { time: '14:23:10', label: 'UPI transfer initiated', icon: '💸', done: paid },
];

const defaultClaims: Claim[] = [
  {
    id: 'CLM001', date: '2026-03-14', submittedAt: '14:23:10',
    type: 'Heavy Rain', amount: 420, status: 'paid',
    trigger: '🌧️ IMD Rain >50mm', zone: 'Chennai South',
    timeline: defaultTimeline(true), isManual: false,
  },
  {
    id: 'CLM002', date: '2026-03-07', submittedAt: '11:15:44',
    type: 'App Outage', amount: 350, status: 'paid',
    trigger: '📱 Zomato Outage 3h', zone: 'Chennai — City-wide',
    timeline: defaultTimeline(true), isManual: false,
  },
  {
    id: 'CLM003', date: '2026-02-22', submittedAt: '09:42:18',
    type: 'AQI Alert', amount: 210, status: 'paid',
    trigger: '💨 AQI >300 Severe', zone: 'Chennai West',
    timeline: defaultTimeline(true), isManual: false,
  },
  {
    id: 'CLM004', date: '2026-02-10', submittedAt: '16:05:33',
    type: 'Curfew', amount: 420, status: 'processing',
    trigger: '🚫 Section 144', zone: 'Chennai Central',
    timeline: [
      { time: '16:05:33', label: 'Trigger submitted (Govt alert API)', icon: '📡', done: true },
      { time: '16:06:00', label: 'Zone validation in progress', icon: '📍', done: true },
      { time: '16:10:00', label: 'Manual review initiated', icon: '👤', done: true },
      { time: '—', label: 'Fraud check pending', icon: '🤖', done: false },
      { time: '—', label: 'Payout pending', icon: '💸', done: false },
    ],
    isManual: false,
  },
  {
    id: 'CLM005', date: '2026-01-28', submittedAt: '13:20:01',
    type: 'Heatwave', amount: 180, status: 'rejected',
    trigger: '🌡️ Heat 42°C', zone: 'Chennai North',
    timeline: [
      { time: '13:20:01', label: 'Trigger submitted', icon: '📡', done: true },
      { time: '13:20:45', label: 'Location validated', icon: '📍', done: true },
      { time: '13:22:00', label: 'IMD threshold check — 41.8°C (below Gold limit 42°C)', icon: '🌡️', done: true },
      { time: '13:22:10', label: 'Claim rejected: threshold not met by 0.2°C', icon: '❌', done: true },
    ],
    description: 'Temperature recorded was 41.8°C, below the Gold Shield trigger of 42°C.',
    isManual: false,
  },
];

const defaultPolicy: Policy = {
  id: 'POL001',
  policyNumber: 'GS-2026-CH-4821',
  tier: 'gold',
  status: 'active',
  startDate: '2026-03-01',
  endDate: '2026-09-01',
  weeklyPremium: 115,
  totalPremiumPaid: 920,
  maxPayoutPerDay: 4000,
  autoRenew: true,
  weeksCovered: 8,
  claimCount: 5,
  lastRenewalDate: '2026-03-29',
  addOns: [
    { id: 'ao1', name: 'Hospital Cash Cover', description: '₹500/day for hospitalisation (up to 30 days)', weeklyPremium: 18, active: true },
    { id: 'ao2', name: 'PA Accident Cover', description: '₹2,00,000 personal accident sum assured', weeklyPremium: 28, active: false },
    { id: 'ao3', name: 'Life Cover', description: '₹5,00,000 term life (nominee payout)', weeklyPremium: 50, active: false },
  ],
};

// ── Context types ──────────────────────────────────────────────────────────────

interface AppContextType {
  user: UserProfile | null;
  selectedTier: 'bronze' | 'silver' | 'gold' | null;
  isAuthenticated: boolean;
  language: 'en' | 'hi';
  coverageActive: boolean;
  alertActive: boolean;
  claims: Claim[];
  notifications: number;
  policy: Policy | null;
  premiumFactors: PremiumInputFactors;
  registrationStep: RegistrationStep;

  setUser: (user: UserProfile | null) => void;
  setSelectedTier: (tier: 'bronze' | 'silver' | 'gold' | null) => void;
  setAuthenticated: (val: boolean) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  setCoverageActive: (val: boolean) => void;
  setAlertActive: (val: boolean) => void;
  setPolicy: (policy: Policy | null) => void;
  updatePolicy: (updates: Partial<Policy>) => void;
  setPremiumFactors: (factors: Partial<PremiumInputFactors>) => void;
  setRegistrationStep: (step: RegistrationStep) => void;
  addClaim: (claim: Omit<Claim, 'id'>) => void;
  updateClaim: (id: string, updates: Partial<Claim>) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedTier, setSelectedTier] = useState<'bronze' | 'silver' | 'gold' | null>(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [coverageActive, setCoverageActive] = useState(true);
  const [alertActive, setAlertActive] = useState(false);
  const [claims, setClaims] = useState<Claim[]>(defaultClaims);
  const [notifications] = useState(3);
  const [policy, setPolicy] = useState<Policy | null>(defaultPolicy);
  const [premiumFactors, setPremiumFactorsState] = useState<PremiumInputFactors>(defaultPremiumFactors);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('personal');

  const setPremiumFactors = (factors: Partial<PremiumInputFactors>) => {
    setPremiumFactorsState(prev => ({ ...prev, ...factors }));
  };

  const updatePolicy = (updates: Partial<Policy>) => {
    setPolicy(prev => prev ? { ...prev, ...updates } : null);
  };

  const addClaim = (claim: Omit<Claim, 'id'>) => {
    const newClaim: Claim = {
      ...claim,
      id: `CLM${String(Date.now()).slice(-6)}`,
    };
    setClaims(prev => [newClaim, ...prev]);
  };

  const updateClaim = (id: string, updates: Partial<Claim>) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const logout = () => {
    setUser(null);
    setAuthenticated(false);
    setSelectedTier(null);
    setPolicy(null);
    setRegistrationStep('personal');
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      selectedTier, setSelectedTier,
      isAuthenticated, setAuthenticated,
      language, setLanguage,
      coverageActive, setCoverageActive,
      alertActive, setAlertActive,
      claims, addClaim, updateClaim,
      notifications,
      policy, setPolicy, updatePolicy,
      premiumFactors, setPremiumFactors,
      registrationStep, setRegistrationStep,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
