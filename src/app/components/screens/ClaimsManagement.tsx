/**
 * GigShield — Full Claims Management
 * Features: File new claim · Real-time status tracking · Audit trail
 *           Document upload (UI) · Appeal rejected claims · Analytics
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Shield, PlusCircle, Filter, TrendingUp, CheckCircle,
  Clock, XCircle, FileText, ChevronRight, ChevronDown,
  Upload, Send, AlertTriangle, RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, type Claim } from '../../context/AppContext';

// ── Types & Constants ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  paid:         { bg: '#DCFCE7', color: '#166534', icon: '✓', label: 'Paid', Icon: CheckCircle },
  processing:   { bg: '#DBEAFE', color: '#1E40AF', icon: '↻', label: 'Processing', Icon: RefreshCw },
  submitted:    { bg: '#F3E8FF', color: '#6B21A8', icon: '📤', label: 'Submitted', Icon: Send },
  under_review: { bg: '#FEF3C7', color: '#92400E', icon: '👤', label: 'Under Review', Icon: Clock },
  rejected:     { bg: '#FEE2E2', color: '#991B1B', icon: '✗', label: 'Rejected', Icon: XCircle },
  appealed:     { bg: '#FFF7ED', color: '#C2410C', icon: '⚖', label: 'Appealed', Icon: AlertTriangle },
};

const EVENT_TYPES = [
  { v: 'Heavy Rain',     emoji: '🌧️', trigger: '🌧️ IMD Rain detected', desc: 'Rainfall exceeded your plan threshold' },
  { v: 'AQI Alert',      emoji: '💨', trigger: '💨 CPCB AQI elevated', desc: 'Air quality exceeded your plan threshold' },
  { v: 'Platform Outage',emoji: '📱', trigger: '📱 Platform downtime',  desc: 'Zomato/Swiggy outage detected' },
  { v: 'Heatwave',       emoji: '🌡️', trigger: '🌡️ IMD Heat alert',    desc: 'Temperature exceeded your plan limit' },
  { v: 'Curfew',         emoji: '🚫', trigger: '🚫 Section 144',       desc: 'Government-issued movement restriction' },
  { v: 'Other',          emoji: '📋', trigger: '📋 Manual event',       desc: 'Other event not auto-triggered' },
];

const FILTER_TABS = ['All', 'Paid', 'Processing', 'Submitted', 'Rejected'] as const;
type FilterTab = typeof FILTER_TABS[number];

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatsHeader({ claims }: { claims: Claim[] }) {
  const totalPaid = claims.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
  const successRate = claims.length ? Math.round((claims.filter(c => c.status === 'paid').length / claims.length) * 100) : 0;
  const avgAmount = claims.filter(c => c.status === 'paid').length
    ? Math.round(totalPaid / claims.filter(c => c.status === 'paid').length) : 0;

  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {[
        { label: 'Total Received', val: `₹${totalPaid.toLocaleString()}`, color: '#10B981' },
        { label: 'Success Rate',   val: `${successRate}%`,                color: '#A78BFA' },
        { label: 'Avg Payout',     val: `₹${avgAmount}`,                  color: '#34D399' },
      ].map(s => (
        <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center">
          <p className="font-bold text-sm" style={{ color: s.color }}>{s.val}</p>
          <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function MiniChart({ claims }: { claims: Claim[] }) {
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  const byMonth = Array(12).fill(0);
  claims.filter(c => c.status === 'paid').forEach(c => {
    const m = new Date(c.date).getMonth();
    byMonth[m] += c.amount;
  });
  const maxVal = Math.max(...byMonth, 1);
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} style={{ color: '#2E1065' }} />
          <span className="font-semibold text-xs" style={{ color: '#2E1065' }}>Monthly Payouts (2026)</span>
        </div>
        <span className="text-xs text-gray-400">₹{byMonth.reduce((a, b) => a + b, 0).toLocaleString()} YTD</span>
      </div>
      <div className="flex items-end gap-0.5 h-14">
        {byMonth.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full rounded-sm transition-all"
              style={{ height: `${(v / maxVal) * 100}%`, background: v > 0 ? '#7C3AED' : '#E2E8F0', minHeight: '3px' }} />
            <span className="text-gray-300" style={{ fontSize: '7px' }}>{months[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClaimCard({
  claim, onAppeal, onViewReceipt,
}: { claim: Claim; onAppeal: (id: string) => void; onViewReceipt: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[claim.status] || STATUS_CONFIG.submitted;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button className="w-full p-4 text-left" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-gray-50">
            {claim.trigger.split(' ')[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-800 truncate">{claim.type}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(claim.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              {claim.zone && <span className="ml-1.5">· {claim.zone}</span>}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="font-bold text-sm"
              style={{ color: claim.status === 'paid' ? '#10B981' : claim.status === 'rejected' ? '#EF4444' : '#F59E0B' }}>
              {claim.status === 'rejected' ? '' : '+'} ₹{claim.amount.toLocaleString()}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: status.bg, color: status.color }}>
              {status.icon} {status.label}
            </span>
          </div>
          <ChevronDown size={14} className="text-gray-300 ml-1 transition-transform flex-shrink-0"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-gray-50 pt-3">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
                {[
                  { k: 'Claim ID', v: claim.id },
                  { k: 'Submitted', v: claim.submittedAt },
                  { k: 'Trigger', v: claim.trigger },
                  { k: 'Amount', v: `₹${claim.amount}` },
                  ...(claim.policyId ? [{ k: 'Policy', v: claim.policyId }] : []),
                  ...(claim.isManual ? [{ k: 'Type', v: 'Manual claim' }] : [{ k: 'Type', v: 'Auto-parametric' }]),
                ].map(row => (
                  <div key={row.k}>
                    <p className="text-xs text-gray-400">{row.k}</p>
                    <p className="text-xs font-medium text-gray-700 mt-0.5 break-all">{row.v}</p>
                  </div>
                ))}
              </div>

              {claim.description && (
                <div className="mb-3 p-2.5 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500 font-medium">Description</p>
                  <p className="text-xs text-gray-600 mt-0.5">{claim.description}</p>
                </div>
              )}

              {/* Audit Timeline */}
              {claim.timeline && claim.timeline.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Verification Audit Trail</p>
                  <div className="space-y-2.5 relative pl-6">
                    <div className="absolute left-3 top-1 bottom-1 w-px bg-gray-100" />
                    {claim.timeline.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 relative">
                        <div className="absolute -left-[18px] w-5 h-5 rounded-full flex items-center justify-center text-xs z-10"
                          style={{ background: step.done ? '#D1FAE5' : '#F3F4F6', border: `1.5px solid ${step.done ? '#10B981' : '#E2E8F0'}` }}>
                          {step.done ? <CheckCircle size={10} className="text-green-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium" style={{ color: step.done ? '#1F2937' : '#9CA3AF' }}>{step.label}</p>
                          <p className="text-xs text-gray-400">{step.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appeal reason */}
              {claim.appealReason && (
                <div className="mb-3 p-2.5 rounded-xl" style={{ background: '#FFF7ED' }}>
                  <p className="text-xs font-medium text-orange-700">Appeal Filed</p>
                  <p className="text-xs text-orange-600 mt-0.5">{claim.appealReason}</p>
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex gap-2">
                {claim.status === 'paid' && (
                  <button onClick={onViewReceipt}
                    className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1"
                    style={{ background: '#F0FDF4', color: '#166534' }}>
                    <FileText size={12} /> View Receipt
                  </button>
                )}
                {claim.status === 'rejected' && !claim.appealReason && (
                  <button onClick={() => onAppeal(claim.id)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1"
                    style={{ background: '#FEF3C7', color: '#92400E' }}>
                    ⚖ File Appeal
                  </button>
                )}
                <button className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 border"
                  style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                  <Upload size={12} /> Share
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── File New Claim Modal ───────────────────────────────────────────────────────

function NewClaimModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [step, setStep] = useState(0);
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [docs, setDocs] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const mockDocs = ['📸 Photo Evidence', '📄 Platform Screenshot', '🌧️ IMD Alert Screenshot'];

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      setTimeout(() => {
        onSubmit({ eventType, date, description, docs });
      }, 1500);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28 }}
        className="w-full bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="px-5 pt-4 pb-2 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg" style={{ color: '#2E1065' }}>File a Claim</h3>
            <button onClick={onClose} className="text-gray-400 text-lg leading-none">✕</button>
          </div>
          {/* Step dots */}
          <div className="flex gap-1.5 mt-2">
            {['Event', 'Details', 'Docs', 'Confirm'].map((l, i) => (
              <div key={l} className="flex-1 flex flex-col gap-0.5">
                <div className="h-1 rounded-full" style={{ background: i <= step ? '#7C3AED' : '#E2E8F0' }} />
                {i === step && <span className="text-xs text-purple-500">{l}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="p-5">
          {done ? (
            <motion.div className="text-center py-8" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="text-6xl mb-3">📤</div>
              <p className="font-bold text-lg" style={{ color: '#2E1065' }}>Claim Submitted!</p>
              <p className="text-gray-500 text-sm mt-1">We'll review your claim and update within 24–48 hours</p>
              <div className="mt-4 p-3 rounded-xl" style={{ background: '#EDE9FE' }}>
                <p className="text-purple-700 text-sm">Claim ID: <span className="font-mono font-bold">CLM{Date.now().toString().slice(-6)}</span></p>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="e0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p className="text-sm text-gray-500 mb-3">Select the event type that caused your loss</p>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {EVENT_TYPES.map(e => (
                      <button key={e.v} onClick={() => setEventType(e.v)}
                        className="flex flex-col gap-1 p-3 rounded-2xl border-2 text-left transition-all"
                        style={{ borderColor: eventType === e.v ? '#7C3AED' : '#E2E8F0', background: eventType === e.v ? '#EDE9FE' : 'white' }}>
                        <span className="text-2xl">{e.emoji}</span>
                        <span className="text-xs font-semibold" style={{ color: eventType === e.v ? '#7C3AED' : '#374151' }}>{e.v}</span>
                        <span className="text-xs text-gray-400 leading-tight">{e.desc}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(1)} disabled={!eventType}
                    className="w-full py-3.5 rounded-2xl text-white font-semibold disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
                    Next: Event Details →
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="e1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p className="text-sm text-gray-500 mb-3">Tell us more about the event</p>
                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">Date of Event *</label>
                      <input type="date" className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 text-gray-800 text-sm"
                        style={{ borderColor: '#E2E8F0' }}
                        value={date} max={new Date().toISOString().split('T')[0]}
                        onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">Description *</label>
                      <textarea
                        className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 text-gray-800 text-sm resize-none"
                        style={{ borderColor: '#E2E8F0' }} rows={4}
                        placeholder={`Describe how ${eventType || 'this event'} affected your ability to work today…`}
                        value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div className="p-3 rounded-xl text-xs" style={{ background: '#EFF6FF' }}>
                      <p className="text-blue-700 font-semibold">💡 Auto-trigger check</p>
                      <p className="text-blue-600 mt-0.5">If this event was auto-detected by our sensors, your claim may already be approved. Check the dashboard first.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="flex-1 py-3.5 rounded-2xl border-2 font-semibold text-sm" style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>← Back</button>
                    <button onClick={() => setStep(2)} disabled={!description.trim()}
                      className="flex-[2] py-3.5 rounded-2xl text-white font-semibold disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
                      Next: Upload Docs →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="e2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p className="text-sm text-gray-500 mb-1">Supporting documents speed up review</p>
                  <p className="text-xs text-gray-400 mb-4">Optional but recommended for manual claims</p>
                  <div className="space-y-2 mb-4">
                    {mockDocs.map(d => (
                      <button key={d} onClick={() => setDocs(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left"
                        style={{ borderColor: docs.includes(d) ? '#7C3AED' : '#E2E8F0', background: docs.includes(d) ? '#EDE9FE' : 'white' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                          style={{ background: docs.includes(d) ? '#7C3AED20' : '#F3F4F6' }}>{d.split(' ')[0]}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: docs.includes(d) ? '#7C3AED' : '#374151' }}>{d}</p>
                          <p className="text-xs text-gray-400">Tap to {docs.includes(d) ? 'remove' : 'add'}</p>
                        </div>
                        {docs.includes(d) && <CheckCircle size={16} className="text-purple-600" />}
                      </button>
                    ))}
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed"
                      style={{ borderColor: '#D1D5DB' }}>
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Upload size={14} className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-400">Upload from device…</p>
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-2xl border-2 font-semibold text-sm" style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>← Back</button>
                    <button onClick={() => setStep(3)}
                      className="flex-[2] py-3.5 rounded-2xl text-white font-semibold"
                      style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
                      Review & Submit →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="e3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p className="text-sm text-gray-500 mb-4">Review your claim before submitting</p>
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 mb-4">
                    {[
                      { k: 'Event Type', v: eventType },
                      { k: 'Date', v: new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                      { k: 'Documents', v: docs.length > 0 ? `${docs.length} attached` : 'None' },
                    ].map(r => (
                      <div key={r.k} className="flex justify-between text-sm">
                        <span className="text-gray-500">{r.k}</span>
                        <span className="font-medium text-gray-700">{r.v}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-medium">Description</p>
                      <p className="text-xs text-gray-600 mt-1">{description}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl mb-4 text-xs" style={{ background: '#EDE9FE' }}>
                    <p className="text-purple-700 font-medium">📋 What happens next?</p>
                    <ul className="text-purple-600 mt-1 space-y-0.5 list-disc list-inside">
                      <li>Claim ID generated immediately</li>
                      <li>AI fraud check within minutes</li>
                      <li>Human review for manual claims (24–48h)</li>
                      <li>UPI payout on approval</li>
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-2xl border-2 font-semibold text-sm" style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>← Back</button>
                    <button onClick={handleSubmit} disabled={submitting}
                      className="flex-[2] py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                      style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}>
                      {submitting
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                        : <><Send size={16} /> Submit Claim</>}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Appeal Modal ───────────────────────────────────────────────────────────────

function AppealModal({ claimId, onClose, onSubmit }: { claimId: string; onClose: () => void; onSubmit: (id: string, reason: string) => void }) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!reason.trim()) return;
    setSubmitting(true);
    setTimeout(() => { onSubmit(claimId, reason); }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28 }}
        className="w-full bg-white rounded-t-3xl p-6"
        onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={20} className="text-amber-500" />
          <h3 className="font-bold text-lg" style={{ color: '#2E1065' }}>File an Appeal</h3>
        </div>
        <p className="text-gray-500 text-sm mb-1">Claim ID: <span className="font-mono font-semibold">{claimId}</span></p>
        <p className="text-gray-400 text-xs mb-4">Appeals are reviewed by a senior claims officer within 72 hours.</p>

        <label className="block text-xs text-gray-500 mb-2 font-medium">Reason for Appeal *</label>
        <select className="w-full border-2 rounded-xl px-3 py-2.5 mb-3 outline-none text-gray-700 text-sm"
          style={{ borderColor: '#E2E8F0' }}
          onChange={e => setReason(prev => e.target.value + (prev ? '\n\n' + prev : ''))}>
          <option value="">Select a reason…</option>
          <option>IMD data shows threshold was exceeded</option>
          <option>Platform outage lasted longer than recorded</option>
          <option>Location data was incorrect</option>
          <option>Claim was rejected in error</option>
          <option>Supporting documents were not considered</option>
        </select>

        <textarea
          className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 text-gray-800 text-sm resize-none mb-4"
          style={{ borderColor: '#E2E8F0' }} rows={4}
          placeholder="Describe why you believe this claim should be approved. Include any additional evidence (sensor readings, screenshots, timestamps)…"
          value={reason} onChange={e => setReason(e.target.value)} />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl border-2 font-semibold text-sm" style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={!reason.trim() || submitting}
            className="flex-[2] py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
              : <>⚖ Submit Appeal</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────

export function ClaimsManagement() {
  const navigate = useNavigate();
  const { claims, addClaim, updateClaim, language } = useApp();
  const [filter, setFilter] = useState<FilterTab>('All');
  const [showNewClaim, setShowNewClaim] = useState(false);
  const [appealClaimId, setAppealClaimId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const t = (en: string, hi: string) => language === 'hi' ? hi : en;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    if (filter === 'All') return claims;
    const map: Record<FilterTab, string[]> = {
      All: [],
      Paid: ['paid'],
      Processing: ['processing', 'under_review'],
      Submitted: ['submitted', 'appealed'],
      Rejected: ['rejected'],
    };
    return claims.filter(c => map[filter].includes(c.status));
  }, [claims, filter]);

  const handleNewClaimSubmit = (data: any) => {
    const ev = EVENT_TYPES.find(e => e.v === data.eventType);
    const amount = 250; // manual claims get base flat pending amount
    addClaim({
      date: data.date,
      submittedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      type: data.eventType,
      amount,
      status: 'submitted',
      trigger: ev?.trigger || '📋 Manual claim',
      description: data.description,
      documents: data.docs,
      isManual: true,
      timeline: [
        { time: new Date().toLocaleTimeString(), label: 'Claim submitted via app', icon: '📤', done: true },
        { time: '—', label: 'AI document verification', icon: '🤖', done: false },
        { time: '—', label: 'Senior claims officer review', icon: '👤', done: false },
        { time: '—', label: 'Payout decision', icon: '💸', done: false },
      ],
    });
    setShowNewClaim(false);
    showToast('Claim submitted! We\'ll review within 24–48 hours.');
  };

  const handleAppealSubmit = (id: string, reason: string) => {
    updateClaim(id, { status: 'appealed', appealReason: reason });
    setAppealClaimId(null);
    showToast('Appeal submitted! Senior officer will review within 72h.');
  };

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: 'linear-gradient(135deg, #2E1065, #4C1D95)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-white" />
          <span className="text-white font-semibold">{t('Claims Management', 'दावा प्रबंधन')}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">{t('My Claims', 'मेरे दावे')}</h1>
            <p className="text-purple-200 text-sm mt-0.5">{t('Full claim history & status tracking', 'पूर्ण दावा इतिहास')}</p>
          </div>
          <button onClick={() => setShowNewClaim(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white border-2 border-white/30 bg-white/10 active:scale-95 transition-all">
            <PlusCircle size={16} /> New
          </button>
        </div>
        <StatsHeader claims={claims} />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-5 mt-3 p-3 rounded-xl flex items-center gap-2"
            style={{ background: '#DCFCE7', border: '1px solid #86EFAC' }}>
            <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
            <p className="text-green-700 text-sm">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 py-4 space-y-4">
        {/* Chart */}
        <MiniChart claims={claims} />

        {/* File new claim CTA */}
        <button onClick={() => setShowNewClaim(true)}
          className="w-full py-3.5 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
          <PlusCircle size={18} /> {t('File a New Claim', 'नया दावा दर्ज करें')}
        </button>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTER_TABS.map(tab => {
            const count = tab === 'All' ? claims.length
              : tab === 'Processing' ? claims.filter(c => ['processing','under_review'].includes(c.status)).length
              : tab === 'Submitted' ? claims.filter(c => ['submitted','appealed'].includes(c.status)).length
              : claims.filter(c => c.status === tab.toLowerCase()).length;
            return (
              <button key={tab} onClick={() => setFilter(tab)}
                className="px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 flex items-center gap-1 transition-all"
                style={{
                  background: filter === tab ? '#2E1065' : 'white',
                  color: filter === tab ? 'white' : '#64748B',
                  border: `1px solid ${filter === tab ? '#2E1065' : '#E2E8F0'}`,
                }}>
                {tab}
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: filter === tab ? 'rgba(255,255,255,0.2)' : '#F1F5F9', color: filter === tab ? 'white' : '#64748B' }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Claims list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl">📭</span>
              <p className="text-gray-400 text-sm mt-2">No {filter.toLowerCase()} claims found</p>
              {filter !== 'All' && (
                <button onClick={() => setFilter('All')} className="mt-2 text-xs" style={{ color: '#7C3AED' }}>Show all claims</button>
              )}
            </div>
          ) : (
            filtered.map((claim, i) => (
              <motion.div key={claim.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <ClaimCard
                  claim={claim}
                  onAppeal={id => setAppealClaimId(id)}
                  onViewReceipt={() => navigate('/app/payout')}
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Info card */}
        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
          <p className="font-semibold text-sm mb-1" style={{ color: '#2E1065' }}>About Parametric Claims</p>
          <p className="text-xs text-purple-400 mb-2">
            Most claims are triggered automatically — no paperwork needed. Manual claims require a 24–48h review. 
            Rejected claims can be appealed within 30 days.
          </p>
          <button onClick={() => navigate('/app/alert')}
            className="flex items-center gap-1 text-xs font-medium" style={{ color: '#7C3AED' }}>
            View Live Trigger Status <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNewClaim && (
          <NewClaimModal onClose={() => setShowNewClaim(false)} onSubmit={handleNewClaimSubmit} />
        )}
        {appealClaimId && (
          <AppealModal claimId={appealClaimId} onClose={() => setAppealClaimId(null)} onSubmit={handleAppealSubmit} />
        )}
      </AnimatePresence>
    </div>
  );
}
