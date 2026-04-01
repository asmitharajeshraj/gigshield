import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Filter, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

const filterTabs = ['All', 'Paid', 'Processing', 'Rejected'];

export function ClaimsHistory() {
  const navigate = useNavigate();
  const { claims, language } = useApp();
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const t = (en: string, hi: string) => language === 'hi' ? hi : en;

  const filtered = filter === 'All' ? claims : claims.filter(c => c.status === filter.toLowerCase() as any);

  const totalPaid = claims.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0);

  const statusConfig = {
    paid: { bg: '#DCFCE7', color: '#166534', label: '✓ Paid' },
    processing: { bg: '#FEF3C7', color: '#92400E', label: '⏳ Processing' },
    rejected: { bg: '#FEE2E2', color: '#991B1B', label: '✗ Rejected' },
  };

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: 'linear-gradient(135deg, #2E1065, #4C1D95)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-white" />
          <span className="text-white font-semibold">GigShield</span>
        </div>
        <h1 className="text-white font-bold text-xl">{t('Claims History', 'दावों का इतिहास')}</h1>
        <p className="text-purple-200 text-sm mt-0.5">{t('All your insurance payouts', 'सभी बीमा भुगतान')}</p>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: t('Total Received', 'कुल प्राप्त'), val: `₹${totalPaid.toLocaleString()}`, color: '#10B981' },
            { label: t('Claims', 'दावे'), val: claims.length.toString(), color: '#A78BFA' },
            { label: t('Success Rate', 'सफलता दर'), val: `${Math.round((claims.filter(c => c.status === 'paid').length / claims.length) * 100)}%`, color: '#34D399' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center">
              <p className="font-bold text-sm" style={{ color: s.color }}>{s.val}</p>
              <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {filterTabs.map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              className="px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all"
              style={{
                background: filter === tab ? '#2E1065' : 'white',
                color: filter === tab ? 'white' : '#64748B',
                border: `1px solid ${filter === tab ? '#2E1065' : '#E2E8F0'}`,
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Chart hint */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} style={{ color: '#2E1065' }} />
              <span className="text-xs font-semibold" style={{ color: '#2E1065' }}>Monthly Payouts</span>
            </div>
            <span className="text-xs text-gray-400">2026</span>
          </div>
          <div className="flex items-end gap-1 h-14">
            {[420, 0, 350, 210, 420, 180, 420, 0, 350, 420, 0, 420].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm transition-all"
                style={{
                  height: `${(h / 420) * 100}%`,
                  background: h > 0 ? '#7C3AED' : '#E2E8F0',
                  minHeight: h > 0 ? '4px' : '4px',
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>Jan</span><span>Jun</span><span>Dec</span>
          </div>
        </div>

        {/* Claims List */}
        <div className="space-y-3 mb-4">
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-4xl">📭</span>
              <p className="text-gray-400 text-sm mt-2">No {filter.toLowerCase()} claims found</p>
            </div>
          ) : (
            filtered.map((claim, idx) => {
              const status = statusConfig[claim.status];
              const isExpanded = expanded === claim.id;
              return (
                <motion.div key={claim.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(isExpanded ? null : claim.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gray-50">
                          {claim.trigger.split(' ')[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{claim.type}</p>
                          <p className="text-xs text-gray-400">{new Date(claim.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <p className="font-bold text-sm" style={{ color: claim.status === 'paid' ? '#10B981' : claim.status === 'processing' ? '#F59E0B' : '#EF4444' }}>
                          {claim.status === 'rejected' ? '' : '+'} ₹{claim.amount}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-gray-50">
                        <div className="space-y-2">
                          {[
                            { k: 'Claim ID', v: claim.id },
                            { k: 'Trigger', v: claim.trigger },
                            { k: 'Date', v: claim.date },
                            { k: 'Amount', v: `₹${claim.amount}` },
                            { k: 'Status', v: status.label },
                          ].map(row => (
                            <div key={row.k} className="flex justify-between text-xs">
                              <span className="text-gray-400">{row.k}</span>
                              <span className="text-gray-700 font-medium">{row.v}</span>
                            </div>
                          ))}
                        </div>
                        {claim.status === 'paid' && (
                          <button
                            onClick={e => { e.stopPropagation(); navigate('/app/payout'); }}
                            className="w-full mt-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1"
                            style={{ background: '#F0FDF4', color: '#166534' }}>
                            View Receipt <ChevronRight size={12} />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </button>
                </motion.div>
              );
            })
          )}
        </div>

        {/* New Claim CTA */}
        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 mb-4">
          <p className="font-semibold text-sm mb-1" style={{ color: '#2E1065' }}>Need to file a manual claim?</p>
          <p className="text-xs text-purple-400 mb-3">For edge cases not covered by auto-payout</p>
          <button onClick={() => navigate('/app/alert')}
            className="px-4 py-2 rounded-xl text-white text-sm font-medium"
            style={{ background: '#2E1065' }}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}