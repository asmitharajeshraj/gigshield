import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, AlertTriangle, ChevronLeft, X, Check, Eye, Ban, Pause, RefreshCw, Filter, Search, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const flaggedClaims = [
  {
    id: 'FRD-2026-001',
    worker: 'Mohammed A.',
    workerId: 'ZOM-CH-7821',
    phone: '9876509823',
    zone: 'Chennai North 600080',
    trigger: '🌧️ Rain >50mm',
    amount: 420,
    mlScore: 92,
    risk: 'Critical',
    reasons: [
      'Worker submitted manual claim during active trigger, but GPS shows 11 deliveries completed in same period.',
      'Duplicate phone fingerprint detected with 3 other accounts.',
    ],
    platform: 'Zomato',
    status: 'flagged',
    time: '14:23',
    date: '2026-03-20',
  },
  {
    id: 'FRD-2026-002',
    worker: 'Vijay R.',
    workerId: 'SWG-MU-3291',
    phone: '9900123456',
    zone: 'Mumbai 400054',
    trigger: '🌡️ Heat >42°C',
    amount: 840,
    mlScore: 78,
    risk: 'High',
    reasons: [
      'Claim submitted from location 45km away from registered pincode.',
      'Weather data shows only 39.2°C at claimed location (threshold: 42°C).',
    ],
    platform: 'Swiggy',
    status: 'flagged',
    time: '11:45',
    date: '2026-03-20',
  },
  {
    id: 'FRD-2026-003',
    worker: 'Ramesh K.',
    workerId: 'ZOM-DL-9182',
    phone: '9811222333',
    zone: 'Delhi 110045',
    trigger: '📱 App Crash 3h+',
    amount: 350,
    mlScore: 65,
    risk: 'Moderate',
    reasons: [
      'App crash duration was 2h 47min (threshold: 3h). Near-boundary claim.',
      'Third claim in 4 weeks — pattern analysis flagged.',
    ],
    platform: 'Zomato',
    status: 'review',
    time: '09:12',
    date: '2026-03-19',
  },
  {
    id: 'FRD-2026-004',
    worker: 'Suresh P.',
    workerId: 'SWG-BN-4421',
    phone: '9845678901',
    zone: 'Bangalore 560036',
    trigger: '💨 AQI >300',
    amount: 210,
    mlScore: 44,
    risk: 'Low',
    reasons: [
      'AQI briefly crossed 300 for 12 minutes — borderline trigger.',
    ],
    platform: 'Swiggy',
    status: 'cleared',
    time: '16:30',
    date: '2026-03-18',
  },
];

const radarData = [
  { subject: 'GPS Match', value: 15 },
  { subject: 'Trigger Valid', value: 20 },
  { subject: 'Claim Freq.', value: 80 },
  { subject: 'Phone Unique', value: 5 },
  { subject: 'Pattern', value: 90 },
  { subject: 'Location', value: 25 },
];

const riskColors: Record<string, string> = {
  Critical: '#EF4444',
  High: '#F59E0B',
  Moderate: '#3B82F6',
  Low: '#10B981',
};

export function FraudDetection() {
  const navigate = useNavigate();
  const [selectedClaim, setSelectedClaim] = useState<typeof flaggedClaims[0] | null>(flaggedClaims[0]);
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(flaggedClaims.map(c => [c.id, c.status]))
  );
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');

  const updateStatus = (id: string, status: string) => {
    setStatuses(prev => ({ ...prev, [id]: status }));
    if (selectedClaim?.id === id) {
      setSelectedClaim(prev => prev ? { ...prev, status } : null);
    }
  };

  const filtered = flaggedClaims.filter(c => {
    const matchSearch = c.worker.toLowerCase().includes(search.toLowerCase()) ||
      c.workerId.toLowerCase().includes(search.toLowerCase()) ||
      c.zone.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === 'All' || c.risk === filterRisk;
    return matchSearch && matchRisk;
  });

  return (
    <div className="min-h-screen flex bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-56 flex flex-col border-r flex-shrink-0" style={{ background: '#2E1065', borderColor: '#3D1A7A' }}>
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: '#3D1A7A' }}>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">GigShield</p>
            <p className="text-purple-300 text-xs">Admin Console</p>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {[
            { icon: Activity, label: 'Dashboard', path: '/admin' },
            { icon: AlertTriangle, label: 'Fraud Detection', path: '/admin/fraud', active: true },
            { icon: Shield, label: 'Risk Engine', path: '/admin' },
          ].map(item => (
            <button key={item.label} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left ${item.active ? 'bg-white/15' : 'hover:bg-white/8'}`}>
              <item.icon size={16} style={{ color: item.active ? 'white' : 'rgba(255,255,255,0.5)' }} />
              <span className="text-sm" style={{ color: item.active ? 'white' : 'rgba(255,255,255,0.6)' }}>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-2 border-t" style={{ borderColor: '#3D1A7A' }}>
          <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8">
            <ChevronLeft size={16} className="text-purple-300" />
            <span className="text-sm text-purple-300">Back to Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <div>
            <h1 className="font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={18} style={{ color: '#EF4444' }} />
              Anomaly & Fraud Detection
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">ML-powered real-time claim analysis · 23 cases flagged today</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              23 Active Flags
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#DCFCE7', color: '#166534' }}>
              ₹4.2L Fraud Prevented
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Claims List */}
          <div className="w-96 flex-shrink-0 border-r bg-white flex flex-col" style={{ borderColor: '#E2E8F0' }}>
            {/* Search & Filter */}
            <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border mb-2" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <Search size={14} className="text-gray-400" />
                <input placeholder="Search claims..." value={search} onChange={e => setSearch(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent text-gray-700" />
              </div>
              <div className="flex gap-1.5">
                {['All', 'Critical', 'High', 'Moderate', 'Low'].map(f => (
                  <button key={f} onClick={() => setFilterRisk(f)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: filterRisk === f ? '#2E1065' : '#F1F5F9',
                      color: filterRisk === f ? 'white' : '#64748B',
                    }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
              {[
                { val: '23', label: 'Flagged', color: '#EF4444' },
                { val: '8', label: 'Held', color: '#F59E0B' },
                { val: '12', label: 'Cleared', color: '#10B981' },
                { val: '3', label: 'Banned', color: '#7C3AED' },
              ].map(s => (
                <div key={s.label} className="text-center p-2 rounded-lg bg-gray-50">
                  <p className="font-bold" style={{ color: s.color }}>{s.val}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: '#F1F5F9' }}>
              {filtered.map(claim => {
                const status = statuses[claim.id];
                return (
                  <button key={claim.id} onClick={() => setSelectedClaim(claim)}
                    className={`w-full p-4 text-left transition-all ${selectedClaim?.id === claim.id ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-sm text-gray-800">{claim.worker}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs px-1.5 py-0.5 rounded font-bold text-white"
                          style={{ background: riskColors[claim.risk] }}>
                          {claim.mlScore}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{claim.workerId} · {claim.zone}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{claim.trigger}</span>
                      <span className="text-xs font-medium" style={{
                        color: status === 'flagged' ? '#EF4444' : status === 'cleared' ? '#10B981' : status === 'banned' ? '#7C3AED' : '#F59E0B'
                      }}>
                        {status === 'flagged' ? '🚨 Flagged' : status === 'cleared' ? '✓ Cleared' : status === 'banned' ? '🚫 Banned' : '⏸ Held'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail Panel */}
          {selectedClaim ? (
            <motion.div key={selectedClaim.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 overflow-y-auto p-6">
              {/* Claim Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-bold text-xl text-gray-800">{selectedClaim.worker}</h2>
                  <p className="text-gray-400 text-sm">{selectedClaim.workerId} · {selectedClaim.phone}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{selectedClaim.zone} · {selectedClaim.date} {selectedClaim.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Claim Amount</p>
                    <p className="font-bold text-xl" style={{ color: '#2E1065' }}>₹{selectedClaim.amount}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-bold text-white"
                    style={{ background: riskColors[selectedClaim.risk] }}>
                    {selectedClaim.risk}
                  </span>
                </div>
              </div>

              {/* ML Score Card */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">ML Anomaly Score</p>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-5xl font-black" style={{ color: riskColors[selectedClaim.risk] }}>
                      {selectedClaim.mlScore}%
                    </span>
                    <span className="text-gray-400 mb-2 text-sm">confidence</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${selectedClaim.mlScore}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${riskColors[selectedClaim.risk]}, ${riskColors[selectedClaim.risk]}aa)` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {selectedClaim.mlScore > 80 ? '⚠️ High fraud probability — Hold payout immediately'
                      : selectedClaim.mlScore > 60 ? '🔍 Moderate risk — Manual review recommended'
                        : '✓ Low risk — Likely legitimate claim'}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Risk Radar</p>
                  <ResponsiveContainer width="100%" height={140}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: '#94A3B8' }} />
                      <Radar name="Risk" dataKey="value" stroke={riskColors[selectedClaim.risk]}
                        fill={riskColors[selectedClaim.risk]} fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Reasons */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
                <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  🤖 AI Analysis Reasons
                </p>
                <div className="space-y-3">
                  {selectedClaim.reasons.map((reason, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#FEF2F2' }}>
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-sm text-red-800 leading-relaxed">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Worker Details */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
                <p className="font-bold text-gray-800 mb-3">Worker Profile</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Platform', val: selectedClaim.platform },
                    { label: 'Worker ID', val: selectedClaim.workerId },
                    { label: 'Phone', val: selectedClaim.phone },
                    { label: 'Trigger', val: selectedClaim.trigger },
                    { label: 'Claim ID', val: selectedClaim.id },
                    { label: 'Date/Time', val: `${selectedClaim.date} ${selectedClaim.time}` },
                  ].map(row => (
                    <div key={row.label} className="p-3 rounded-xl bg-gray-50">
                      <p className="text-xs text-gray-400">{row.label}</p>
                      <p className="text-sm font-medium text-gray-700 mt-0.5">{row.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="font-bold text-gray-800 mb-4">Admin Actions</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateStatus(selectedClaim.id, 'held')}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
                    style={{ background: '#FEF3C7', color: '#92400E' }}>
                    <Pause size={15} /> Hold Payout
                  </button>
                  <button
                    onClick={() => updateStatus(selectedClaim.id, 'review')}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
                    style={{ background: '#DBEAFE', color: '#1E40AF' }}>
                    <Eye size={15} /> Manual Review
                  </button>
                  <button
                    onClick={() => updateStatus(selectedClaim.id, 'cleared')}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
                    style={{ background: '#DCFCE7', color: '#166534' }}>
                    <Check size={15} /> Clear & Pay
                  </button>
                  <button
                    onClick={() => updateStatus(selectedClaim.id, 'banned')}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
                    style={{ background: '#FEE2E2', color: '#991B1B' }}>
                    <Ban size={15} /> Ban Device
                  </button>
                </div>

                {statuses[selectedClaim.id] !== 'flagged' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 rounded-xl text-center"
                    style={{
                      background: statuses[selectedClaim.id] === 'cleared' ? '#DCFCE7' :
                        statuses[selectedClaim.id] === 'banned' ? '#FEE2E2' :
                          statuses[selectedClaim.id] === 'held' ? '#FEF3C7' : '#DBEAFE',
                      color: statuses[selectedClaim.id] === 'cleared' ? '#166534' :
                        statuses[selectedClaim.id] === 'banned' ? '#991B1B' :
                          statuses[selectedClaim.id] === 'held' ? '#92400E' : '#1E40AF',
                    }}>
                    <p className="text-sm font-semibold">
                      {statuses[selectedClaim.id] === 'cleared' ? '✓ Claim cleared — Payout released' :
                        statuses[selectedClaim.id] === 'banned' ? '🚫 Device banned — Payout blocked' :
                          statuses[selectedClaim.id] === 'held' ? '⏸ Payout on hold — Awaiting review' :
                            '🔍 Sent to manual review queue'}
                    </p>
                  </motion.div>
                )}

                <button onClick={() => updateStatus(selectedClaim.id, 'flagged')}
                  className="w-full mt-3 py-2 rounded-xl text-xs text-gray-400 flex items-center justify-center gap-1">
                  <RefreshCw size={12} /> Reset Status
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-300">
              <div className="text-center">
                <AlertTriangle size={40} className="mx-auto mb-2" />
                <p>Select a flagged claim to review</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
