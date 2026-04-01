/**
 * GigShield — Insurance Policy Management
 * Sections: Active Policy · Coverage Triggers · Add-ons · Actions · History
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Shield, ChevronRight, RefreshCw, PauseCircle, XCircle,
  TrendingUp, Download, CheckCircle, AlertTriangle, Star,
  ToggleLeft, ToggleRight, ArrowUpCircle, Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { calculatePremium } from '../../utils/premiumEngine';

const TIER_META = {
  bronze: { emoji: '🥉', color: '#B45309', bg: '#FEF3C7', border: '#D97706', label: 'Bronze Shield' },
  silver: { emoji: '🥈', color: '#475569', bg: '#F1F5F9', border: '#64748B', label: 'Silver Shield' },
  gold:   { emoji: '🥇', color: '#B45309', bg: '#FFFBEB', border: '#EAB308', label: 'Gold Shield' },
};

const STATUS_BADGE = {
  active:    { bg: '#DCFCE7', color: '#166534', label: '● Active' },
  paused:    { bg: '#FEF3C7', color: '#92400E', label: '⏸ Paused' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B', label: '✗ Cancelled' },
  expired:   { bg: '#F3F4F6', color: '#6B7280', label: 'Expired' },
};

const renewalHistory = [
  { date: '2026-03-29', tier: 'gold',   premium: 115, weeks: 2 },
  { date: '2026-03-15', tier: 'gold',   premium: 115, weeks: 2 },
  { date: '2026-03-01', tier: 'silver', premium: 59,  weeks: 2 },
  { date: '2026-02-15', tier: 'silver', premium: 59,  weeks: 2 },
];

type ModalType = 'upgrade' | 'pause' | 'cancel' | 'addon' | null;

export function PolicyManagement() {
  const navigate = useNavigate();
  const { policy, updatePolicy, user, premiumFactors, selectedTier, language } = useApp();
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedAddOn, setSelectedAddOn] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [upgradeTarget, setUpgradeTarget] = useState<'silver' | 'gold'>('gold');
  const [actionDone, setActionDone] = useState<string | null>(null);
  const [expandSection, setExpandSection] = useState<string | null>('coverage');

  const t = (en: string, hi: string) => language === 'hi' ? hi : en;

  const tier = policy?.tier || selectedTier || 'gold';
  const meta = TIER_META[tier];
  const statusMeta = STATUS_BADGE[policy?.status || 'active'];

  // Live premium from engine
  const premResult = calculatePremium(tier, premiumFactors);

  const handleToggleAddOn = (id: string) => {
    if (!policy) return;
    const addOns = policy.addOns.map(a => a.id === id ? { ...a, active: !a.active } : a);
    updatePolicy({ addOns });
    setActionDone(`Add-on ${addOns.find(a => a.id === id)?.active ? 'activated' : 'deactivated'}!`);
    setTimeout(() => setActionDone(null), 2500);
    setModal(null);
  };

  const handleUpgrade = () => {
    updatePolicy({ tier: upgradeTarget, weeklyPremium: upgradeTarget === 'gold' ? 115 : 59, maxPayoutPerDay: upgradeTarget === 'gold' ? 4000 : 2500 });
    setActionDone('Plan upgraded! Effective next renewal.');
    setTimeout(() => setActionDone(null), 3000);
    setModal(null);
  };

  const handlePause = () => {
    updatePolicy({ status: 'paused', autoRenew: false });
    setActionDone('Coverage paused. Auto-pay stopped.');
    setTimeout(() => setActionDone(null), 3000);
    setModal(null);
  };

  const handleResume = () => {
    updatePolicy({ status: 'active', autoRenew: true });
    setActionDone('Coverage resumed!');
    setTimeout(() => setActionDone(null), 2500);
  };

  const handleCancel = () => {
    if (!cancelReason) return;
    updatePolicy({ status: 'cancelled', autoRenew: false });
    setActionDone('Policy cancelled. Your data is retained for 90 days.');
    setTimeout(() => setActionDone(null), 4000);
    setModal(null);
  };

  const toggleSection = (s: string) => setExpandSection(prev => prev === s ? null : s);

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: 'linear-gradient(135deg, #2E1065, #4C1D95)' }}>
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate(-1)} className="text-white/70 mr-1">←</button>
          <Shield size={16} className="text-white" />
          <span className="text-white font-semibold text-sm">Policy Management</span>
        </div>

        {/* Active Policy Card */}
        <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{meta.emoji}</span>
                <span className="text-white font-bold">{meta.label}</span>
              </div>
              <p className="text-white/60 text-xs font-mono">{policy?.policyNumber || 'GS-2026-CH-4821'}</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: statusMeta.bg, color: statusMeta.color }}>
              {statusMeta.label}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { l: t('Weekly Premium', 'साप्ताहिक'), v: `₹${policy?.weeklyPremium || premResult.finalPremium}` },
              { l: t('Max Payout', 'अधिकतम'), v: `₹${(policy?.maxPayoutPerDay || premResult.maxPayoutPerDay).toLocaleString()}/day` },
              { l: t('Weeks Active', 'सप्ताह'), v: `${policy?.weeksCovered || 8} wks` },
            ].map(s => (
              <div key={s.l} className="bg-white/10 rounded-xl p-2 text-center">
                <p className="text-white font-bold text-sm">{s.v}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <div>
              <p className="text-white/50 text-xs">Next renewal</p>
              <p className="text-white text-sm font-medium">{policy?.lastRenewalDate || '2026-04-05'}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-xs">AutoPay {policy?.autoRenew ? 'ON' : 'OFF'}</span>
              <button onClick={() => updatePolicy({ autoRenew: !policy?.autoRenew })}
                className="ml-1 text-white/60 hover:text-white transition-colors">
                {policy?.autoRenew ? <ToggleRight size={18} className="text-green-400" /> : <ToggleLeft size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {actionDone && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-5 mt-3 p-3 rounded-xl flex items-center gap-2"
            style={{ background: '#DCFCE7', border: '1px solid #86EFAC' }}>
            <CheckCircle size={16} className="text-green-600" />
            <p className="text-green-700 text-sm font-medium">{actionDone}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 py-4 space-y-3">

        {/* ── Coverage Triggers ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button className="w-full p-4 flex items-center justify-between" onClick={() => toggleSection('coverage')}>
            <div className="flex items-center gap-2">
              <Zap16 />
              <span className="font-semibold text-sm" style={{ color: '#2E1065' }}>Coverage & Trigger Thresholds</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 transition-transform" style={{ transform: expandSection === 'coverage' ? 'rotate(90deg)' : 'none' }} />
          </button>
          <AnimatePresence>
            {expandSection === 'coverage' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <div className="px-4 pb-4 border-t border-gray-50">
                  <div className="mt-3 space-y-2">
                    {premResult.triggerThresholds.map(tr => (
                      <div key={tr.event} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <span className="text-lg w-7 text-center">{tr.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">{tr.event}</p>
                          <p className="text-xs text-gray-400">{tr.threshold}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tr.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {tr.active ? tr.payout : 'Not covered'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate('/app/premium-calc')}
                    className="mt-3 w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1"
                    style={{ background: '#EDE9FE', color: '#7C3AED' }}>
                    🔢 Recalculate My Premium <ChevronRight size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Premium Breakdown ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button className="w-full p-4 flex items-center justify-between" onClick={() => toggleSection('premium')}>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} style={{ color: '#2E1065' }} />
              <span className="font-semibold text-sm" style={{ color: '#2E1065' }}>AI Premium Breakdown</span>
            </div>
            <span className="text-sm font-bold" style={{ color: meta.color }}>₹{premResult.finalPremium}/wk</span>
          </button>
          <AnimatePresence>
            {expandSection === 'premium' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <div className="px-4 pb-4 border-t border-gray-50">
                  <div className="mt-3 space-y-1.5">
                    {premResult.breakdown.map(b => (
                      <div key={b.label} className="flex justify-between text-xs">
                        <span className="text-gray-500">{b.label}</span>
                        <span className="font-medium" style={{ color: b.type === 'subtract' ? '#10B981' : b.type === 'base' ? '#2E1065' : '#EF4444' }}>
                          {b.type === 'subtract' ? '−' : b.type === 'base' ? '' : '+'}₹{b.amount}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-100">
                      <span style={{ color: '#2E1065' }}>Total Weekly Premium</span>
                      <span style={{ color: meta.color }}>₹{premResult.finalPremium}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2.5 rounded-xl text-xs" style={{ background: '#F0FDF4' }}>
                    <p className="text-green-700 font-medium">💰 You save ₹{premResult.savingsVsIndustry.toLocaleString()}/yr vs traditional insurance</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Add-ons ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button className="w-full p-4 flex items-center justify-between" onClick={() => toggleSection('addons')}>
            <div className="flex items-center gap-2">
              <Star size={14} style={{ color: '#2E1065' }} />
              <span className="font-semibold text-sm" style={{ color: '#2E1065' }}>Add-on Covers</span>
            </div>
            <span className="text-xs text-gray-400">{policy?.addOns.filter(a => a.active).length || 1} active</span>
          </button>
          <AnimatePresence>
            {expandSection === 'addons' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <div className="px-4 pb-4 border-t border-gray-50 mt-0 space-y-2 pt-3">
                  {(policy?.addOns || []).map(addon => (
                    <div key={addon.id} className="flex items-center gap-3 p-3 rounded-xl border"
                      style={{ borderColor: addon.active ? '#A78BFA' : '#E2E8F0', background: addon.active ? '#FAF5FF' : 'white' }}>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: addon.active ? '#2E1065' : '#64748B' }}>{addon.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{addon.description}</p>
                        <p className="text-xs font-semibold mt-1" style={{ color: '#7C3AED' }}>+₹{addon.weeklyPremium}/wk</p>
                      </div>
                      <button onClick={() => handleToggleAddOn(addon.id)}
                        className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
                        style={{ background: addon.active ? '#7C3AED' : '#E2E8F0' }}>
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all"
                          style={{ left: addon.active ? '26px' : '2px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Policy Actions ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="font-semibold text-sm mb-3" style={{ color: '#2E1065' }}>Policy Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {tier !== 'gold' && (
              <button onClick={() => setModal('upgrade')}
                className="flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all"
                style={{ borderColor: '#EAB308', background: '#FFFBEB', color: '#B45309' }}>
                <ArrowUpCircle size={16} /> Upgrade Plan
              </button>
            )}
            <button onClick={() => navigate('/app/premium-calc')}
              className="flex items-center gap-2 p-3 rounded-xl border text-sm font-medium"
              style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>
              <RefreshCw size={14} /> Recalculate
            </button>
            <button className="flex items-center gap-2 p-3 rounded-xl border text-sm font-medium"
              style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>
              <Download size={14} /> Certificate
            </button>
            {policy?.status === 'active' ? (
              <button onClick={() => setModal('pause')}
                className="flex items-center gap-2 p-3 rounded-xl border text-sm font-medium"
                style={{ borderColor: '#FEF3C7', background: '#FFFBEB', color: '#92400E' }}>
                <PauseCircle size={14} /> Pause Cover
              </button>
            ) : policy?.status === 'paused' ? (
              <button onClick={handleResume}
                className="flex items-center gap-2 p-3 rounded-xl border text-sm font-medium"
                style={{ borderColor: '#DCFCE7', background: '#F0FDF4', color: '#166534' }}>
                <CheckCircle size={14} /> Resume
              </button>
            ) : null}
            <button onClick={() => setModal('cancel')}
              className="flex items-center gap-2 p-3 rounded-xl border text-sm font-medium col-span-2"
              style={{ borderColor: '#FEE2E2', background: '#FFF5F5', color: '#991B1B' }}>
              <XCircle size={14} /> Cancel Policy
            </button>
          </div>
        </div>

        {/* ── Renewal History ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button className="w-full p-4 flex items-center justify-between" onClick={() => toggleSection('history')}>
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color: '#2E1065' }} />
              <span className="font-semibold text-sm" style={{ color: '#2E1065' }}>Renewal History</span>
            </div>
            <span className="text-xs text-gray-400">{renewalHistory.length} renewals</span>
          </button>
          <AnimatePresence>
            {expandSection === 'history' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-2">
                  {renewalHistory.map((r, i) => {
                    const m = TIER_META[r.tier as keyof typeof TIER_META];
                    return (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <span className="text-lg">{m.emoji}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">{m.label}</p>
                          <p className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · {r.weeks} weeks</p>
                        </div>
                        <span className="font-semibold text-sm" style={{ color: '#2E1065' }}>₹{r.premium * r.weeks}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between pt-2 text-sm">
                    <span className="text-gray-500">Total Premium Paid</span>
                    <span className="font-bold" style={{ color: '#2E1065' }}>₹{policy?.totalPremiumPaid || 920}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end"
            onClick={() => setModal(null)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              {modal === 'upgrade' && (
                <>
                  <h3 className="font-bold text-lg mb-1" style={{ color: '#2E1065' }}>Upgrade Your Plan</h3>
                  <p className="text-gray-400 text-sm mb-4">Effective from next weekly renewal</p>
                  <div className="space-y-3 mb-4">
                    {(['silver', 'gold'] as const).filter(t => t !== tier).map(t => {
                      const m = TIER_META[t];
                      const calc = calculatePremium(t, premiumFactors);
                      return (
                        <button key={t} onClick={() => setUpgradeTarget(t)}
                          className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left"
                          style={{ borderColor: upgradeTarget === t ? m.border : '#E2E8F0', background: upgradeTarget === t ? m.bg : 'white' }}>
                          <span className="text-2xl">{m.emoji}</span>
                          <div className="flex-1">
                            <p className="font-semibold" style={{ color: m.color }}>{m.label}</p>
                            <p className="text-xs text-gray-400">Max payout ₹{calc.maxPayoutPerDay.toLocaleString()}/day</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold" style={{ color: m.color }}>₹{calc.finalPremium}/wk</p>
                            {upgradeTarget === t && <CheckCircle size={14} className="ml-auto mt-1" style={{ color: m.border }} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={handleUpgrade}
                    className="w-full py-4 rounded-2xl text-white font-bold"
                    style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
                    Confirm Upgrade to {TIER_META[upgradeTarget].label}
                  </button>
                </>
              )}

              {modal === 'pause' && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={20} className="text-amber-500" />
                    <h3 className="font-bold text-lg" style={{ color: '#2E1065' }}>Pause Coverage</h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">Your coverage will be paused immediately. UPI AutoPay will stop. Resume anytime.</p>
                  <div className="p-3 rounded-xl mb-5" style={{ background: '#FEF3C7' }}>
                    <p className="text-amber-800 text-xs font-medium">⚠️ During pause, no new claims can be filed. Existing processing claims will continue.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-2xl border-2 font-semibold text-sm" style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>Cancel</button>
                    <button onClick={handlePause} className="flex-1 py-3 rounded-2xl font-semibold text-white text-sm" style={{ background: '#F59E0B' }}>Pause Coverage</button>
                  </div>
                </>
              )}

              {modal === 'cancel' && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle size={20} className="text-red-500" />
                    <h3 className="font-bold text-lg" style={{ color: '#2E1065' }}>Cancel Policy</h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">This will permanently cancel your policy. Any premium paid this week is non-refundable.</p>
                  <label className="block text-xs text-gray-500 mb-2 font-medium">Reason for cancellation *</label>
                  <select className="w-full border-2 rounded-xl px-3 py-3 mb-4 outline-none text-gray-700 text-sm"
                    style={{ borderColor: '#E2E8F0' }}
                    value={cancelReason} onChange={e => setCancelReason(e.target.value)}>
                    <option value="">Select a reason…</option>
                    <option>Too expensive</option>
                    <option>No longer delivering</option>
                    <option>Switching platforms</option>
                    <option>Claims experience was poor</option>
                    <option>Found better alternative</option>
                    <option>Other</option>
                  </select>
                  <div className="flex gap-3">
                    <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-2xl border-2 font-semibold text-sm" style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>Keep Policy</button>
                    <button onClick={handleCancel} disabled={!cancelReason}
                      className="flex-1 py-3 rounded-2xl font-semibold text-white text-sm disabled:opacity-50" style={{ background: '#EF4444' }}>
                      Cancel Policy
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// tiny inline icon component to avoid import confusion
function Zap16() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2E1065" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
