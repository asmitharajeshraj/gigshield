/**
 * GigShield — Dynamic Premium Calculator
 * Live-updating premium engine with all risk factors, tier comparison, and detailed breakdown.
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Shield, RefreshCw, CheckCircle, ChevronRight, Info,
  Sliders, ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  calculatePremium, compareAllTiers,
  type Tier, type Season, type AQIZone, type PremiumInputFactors,
} from '../../utils/premiumEngine';

const CITIES = ['Chennai','Mumbai','Delhi','Bangalore','Hyderabad','Kolkata','Pune','Ahmedabad','Surat','Jaipur','Lucknow','Bhopal'];

const SEASONS: { v: Season; l: string; emoji: string }[] = [
  { v: 'monsoon', l: 'Monsoon (Jun–Sep)', emoji: '🌧️' },
  { v: 'summer',  l: 'Summer (Mar–May)',  emoji: '☀️' },
  { v: 'winter',  l: 'Winter (Nov–Feb)',  emoji: '❄️' },
  { v: 'normal',  l: 'Normal',            emoji: '🌤️' },
];

const AQI_ZONES: { v: AQIZone; l: string; color: string }[] = [
  { v: 'low',      l: 'Good (<50)',       color: '#10B981' },
  { v: 'moderate', l: 'Moderate (50–150)', color: '#F59E0B' },
  { v: 'high',     l: 'Poor (150–200)',   color: '#F97316' },
  { v: 'severe',   l: 'Severe (>200)',    color: '#EF4444' },
];

const TIER_META = {
  bronze: { emoji: '🥉', color: '#B45309', bg: '#FEF3C7', border: '#D97706', label: 'Bronze Shield', tagline: 'Basic protection' },
  silver: { emoji: '🥈', color: '#475569', bg: '#F1F5F9', border: '#64748B', label: 'Silver Shield', tagline: 'Enhanced cover' },
  gold:   { emoji: '🥇', color: '#B45309', bg: '#FFFBEB', border: '#EAB308', label: 'Gold Shield',   tagline: 'Maximum AI-powered' },
};

function Toggle({ label, sub, value, onChange }: { label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      <button onClick={() => onChange(!value)}
        className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
        style={{ background: value ? '#7C3AED' : '#E2E8F0' }}>
        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all"
          style={{ left: value ? '26px' : '2px' }} />
      </button>
    </div>
  );
}

function SliderField({ label, min, max, step, value, onChange, unit, low, high }: {
  label: string; min: number; max: number; step: number;
  value: number; onChange: (v: number) => void;
  unit: string; low: string; high: string;
}) {
  return (
    <div className="py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold" style={{ color: '#2E1065' }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full accent-purple-700" />
      <div className="flex justify-between text-xs text-gray-300 mt-0.5">
        <span>{low}</span><span>{high}</span>
      </div>
    </div>
  );
}

export function PremiumCalculator() {
  const navigate = useNavigate();
  const { premiumFactors, setPremiumFactors, setSelectedTier, user, language } = useApp();

  const [factors, setFactors] = useState<PremiumInputFactors>({
    ...premiumFactors,
    city: user?.city || premiumFactors.city,
    platform: user?.platform || premiumFactors.platform,
    hoursPerDay: user?.hoursPerDay || premiumFactors.hoursPerDay,
    experienceYears: user?.experienceYears || premiumFactors.experienceYears,
  });

  const [activeTier, setActiveTier] = useState<Tier>('gold');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [applied, setApplied] = useState(false);

  const update = (key: keyof PremiumInputFactors, val: any) =>
    setFactors(prev => ({ ...prev, [key]: val }));

  // Live calculation — re-runs on every factor change
  const result = useMemo(() => calculatePremium(activeTier, factors), [activeTier, factors]);
  const comparison = useMemo(() => compareAllTiers(factors), [factors]);

  const handleApply = () => {
    setPremiumFactors(factors);
    setSelectedTier(activeTier);
    setApplied(true);
    setTimeout(() => { setApplied(false); navigate('/premium'); }, 1200);
  };

  const t = (en: string, hi: string) => language === 'hi' ? hi : en;

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: 'linear-gradient(135deg, #2E1065, #4C1D95)' }}>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => navigate(-1)} className="text-white/70 mr-1"><ArrowLeft size={18} /></button>
          <Shield size={16} className="text-white" />
          <span className="text-white font-semibold text-sm">Dynamic Premium Calculator</span>
        </div>
        <p className="text-purple-200 text-xs">Adjust your risk profile — premiums update instantly</p>

        {/* Live premium hero */}
        <motion.div className="mt-4 bg-white/10 rounded-2xl p-4 border border-white/20"
          key={result.finalPremium} initial={{ scale: 0.98 }} animate={{ scale: 1 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs">Your estimated premium</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <motion.span className="text-4xl font-black text-white"
                  key={result.finalPremium}
                  initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.25 }}>
                  ₹{result.finalPremium}
                </motion.span>
                <span className="text-white/60 text-sm">/week</span>
              </div>
              <p className="text-green-300 text-xs mt-1">
                Max payout: ₹{result.maxPayoutPerDay.toLocaleString()}/day
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl">{TIER_META[activeTier].emoji}</span>
              <p className="text-white/70 text-xs mt-1">{TIER_META[activeTier].label}</p>
            </div>
          </div>

          {/* Tier quick-switch */}
          <div className="flex gap-1.5 mt-3">
            {(['bronze', 'silver', 'gold'] as Tier[]).map(tier => (
              <button key={tier} onClick={() => setActiveTier(tier)}
                className="flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: activeTier === tier ? 'white' : 'rgba(255,255,255,0.1)',
                  color: activeTier === tier ? '#2E1065' : 'rgba(255,255,255,0.7)',
                }}>
                {TIER_META[tier].emoji} {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="px-5 py-4 space-y-4">

        {/* ── Calculator Controls ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sliders size={14} style={{ color: '#2E1065' }} />
            <span className="font-semibold text-sm" style={{ color: '#2E1065' }}>Risk Factors</span>
          </div>

          {/* City */}
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">City</label>
            <div className="flex flex-wrap gap-1.5">
              {CITIES.map(c => (
                <button key={c} onClick={() => update('city', c)}
                  className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                  style={{
                    borderColor: factors.city === c ? '#7C3AED' : '#E2E8F0',
                    background: factors.city === c ? '#EDE9FE' : 'white',
                    color: factors.city === c ? '#7C3AED' : '#64748B',
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ v: 'zomato', l: '🍕 Zomato', c: '#E23744' }, { v: 'swiggy', l: '🛵 Swiggy', c: '#FC8019' }].map(p => (
                <button key={p.v} onClick={() => update('platform', p.v)}
                  className="py-2 rounded-xl text-sm font-medium border-2 transition-all"
                  style={{ borderColor: factors.platform === p.v ? p.c : '#E2E8F0', background: factors.platform === p.v ? `${p.c}10` : 'white', color: factors.platform === p.v ? p.c : '#64748B' }}>
                  {p.l}
                </button>
              ))}
            </div>
          </div>

          <SliderField label="Work Hours / Day" min={2} max={16} step={1}
            value={factors.hoursPerDay} onChange={v => update('hoursPerDay', v)}
            unit="h" low="2h" high="16h" />
          <SliderField label="Experience" min={0} max={10} step={1}
            value={factors.experienceYears} onChange={v => update('experienceYears', v)}
            unit={factors.experienceYears === 1 ? ' yr' : ' yrs'}
            low="New" high="10+ yrs" />
          <SliderField label="Loyalty (claim-free weeks)" min={0} max={20} step={1}
            value={factors.loyaltyWeeks} onChange={v => update('loyaltyWeeks', v)}
            unit=" wks" low="0" high="20" />

          {/* Season */}
          <div className="py-2.5 border-b border-gray-50">
            <label className="block text-xs text-gray-500 mb-2 font-medium">Season</label>
            <div className="grid grid-cols-2 gap-1.5">
              {SEASONS.map(s => (
                <button key={s.v} onClick={() => update('season', s.v)}
                  className="flex items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all"
                  style={{ borderColor: factors.season === s.v ? '#7C3AED' : '#E2E8F0', background: factors.season === s.v ? '#EDE9FE' : 'white', color: factors.season === s.v ? '#7C3AED' : '#64748B' }}>
                  <span>{s.emoji}</span> {s.l}
                </button>
              ))}
            </div>
          </div>

          {/* AQI Zone */}
          <div className="py-2.5 border-b border-gray-50">
            <label className="block text-xs text-gray-500 mb-2 font-medium">AQI Zone</label>
            <div className="grid grid-cols-2 gap-1.5">
              {AQI_ZONES.map(a => (
                <button key={a.v} onClick={() => update('aqiZone', a.v)}
                  className="p-2 rounded-xl border text-xs font-medium transition-all text-left"
                  style={{ borderColor: factors.aqiZone === a.v ? a.color : '#E2E8F0', background: factors.aqiZone === a.v ? `${a.color}15` : 'white', color: factors.aqiZone === a.v ? a.color : '#64748B' }}>
                  <span className="block font-semibold">{a.l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <Toggle label="Flood-Prone Zone" sub="NDMA flood risk map" value={factors.floodRisk} onChange={v => update('floodRisk', v)} />
          <Toggle label="Prior Accident (2 yrs)" sub="Affects premium loading" value={factors.hasAccidentHistory} onChange={v => update('hasAccidentHistory', v)} />
          <Toggle label="Hospital Cash Add-on" sub="+₹18/wk · ₹500/day hospitalisation" value={factors.hospitalCashAddOn} onChange={v => update('hospitalCashAddOn', v)} />
          <Toggle label="PA Accident Cover Add-on" sub="+₹28/wk · ₹2L sum assured" value={factors.accidentCoverAddOn} onChange={v => update('accidentCoverAddOn', v)} />
        </div>

        {/* ── Tier Comparison Table ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="font-semibold text-sm mb-3" style={{ color: '#2E1065' }}>Tier Comparison (Your Profile)</p>
          <div className="grid grid-cols-3 gap-2">
            {(['bronze', 'silver', 'gold'] as Tier[]).map(tier => {
              const m = TIER_META[tier];
              const r = comparison[tier];
              const isActive = activeTier === tier;
              return (
                <button key={tier} onClick={() => setActiveTier(tier)}
                  className="flex flex-col items-center p-3 rounded-2xl border-2 transition-all"
                  style={{ borderColor: isActive ? m.border : '#E2E8F0', background: isActive ? m.bg : 'white' }}>
                  <span className="text-2xl mb-1">{m.emoji}</span>
                  <span className="text-xs font-semibold" style={{ color: m.color }}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </span>
                  <motion.span className="font-black text-base mt-1" style={{ color: '#2E1065' }}
                    key={r.finalPremium} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    ₹{r.finalPremium}
                  </motion.span>
                  <span className="text-xs text-gray-400 mt-0.5">/week</span>
                  <span className="text-xs mt-1 font-medium" style={{ color: m.color }}>
                    ↑ ₹{r.maxPayoutPerDay.toLocaleString()}/day
                  </span>
                  {isActive && <CheckCircle size={12} className="mt-1" style={{ color: m.border }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Breakdown ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button className="w-full p-4 flex items-center justify-between"
            onClick={() => setShowBreakdown(s => !s)}>
            <div className="flex items-center gap-2">
              <Info size={14} style={{ color: '#2E1065' }} />
              <span className="font-semibold text-sm" style={{ color: '#2E1065' }}>Detailed Breakdown</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 transition-transform"
              style={{ transform: showBreakdown ? 'rotate(90deg)' : 'none' }} />
          </button>
          <AnimatePresence>
            {showBreakdown && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-2">
                  {result.breakdown.map((b, i) => (
                    <div key={i} className="flex justify-between items-start text-sm">
                      <div className="flex-1 pr-3">
                        <p className="text-gray-700 font-medium">{b.label}</p>
                        {b.reason && <p className="text-xs text-gray-400 mt-0.5">{b.reason}</p>}
                      </div>
                      <span className="font-semibold flex-shrink-0"
                        style={{ color: b.type === 'subtract' ? '#10B981' : b.type === 'base' ? '#2E1065' : '#EF4444' }}>
                        {b.type === 'subtract' ? '−' : b.type === 'base' ? '' : '+'}₹{b.amount}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="font-bold text-sm" style={{ color: '#2E1065' }}>Weekly Premium</span>
                    <span className="font-black text-lg" style={{ color: TIER_META[activeTier].color }}>
                      ₹{result.finalPremium}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl mt-1" style={{ background: '#F0FDF4' }}>
                    <p className="text-green-700 text-xs font-semibold">
                      💰 Annual savings vs traditional insurance: ₹{result.savingsVsIndustry.toLocaleString()}
                    </p>
                    <p className="text-green-600 text-xs mt-0.5">Traditional policies charge avg ₹{(result.finalPremium * 18 / 52).toFixed(0)}/week for equivalent cover</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Apply Button ────────────────────────────────────────────── */}
        <button onClick={handleApply} disabled={applied}
          className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
          style={{ background: applied ? '#10B981' : 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
          {applied ? (
            <><CheckCircle size={18} /> Applied! Redirecting to Plans…</>
          ) : (
            <>{TIER_META[activeTier].emoji} Apply {TIER_META[activeTier].label} — ₹{result.finalPremium}/wk</>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">
          Premiums are AI-calculated · IRDAI regulated · Cancel anytime
        </p>
      </div>
    </div>
  );
}
