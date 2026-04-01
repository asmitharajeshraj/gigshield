import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Share2, Download, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

const timeline = [
  { time: '14:23:01', label: 'Heavy Rain trigger detected (IMD)', icon: '🌧️', done: true },
  { time: '14:23:03', label: 'Location validated — Pincode 600001', icon: '📍', done: true },
  { time: '14:23:05', label: 'Zomato platform outage confirmed', icon: '📱', done: true },
  { time: '14:23:07', label: 'ML Fraud check passed (99.2% confidence)', icon: '🤖', done: true },
  { time: '14:23:10', label: '₹420 transferred via UPI', icon: '💸', done: true },
];

export function PayoutScreen() {
  const navigate = useNavigate();
  const { user, claims } = useApp();
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

  const totalPaid = claims.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0) + 420;

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      {/* Success Header */}
      <div className="px-5 pt-6 pb-8 text-center" style={{ background: 'linear-gradient(135deg, #065F46, #10B981)' }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"
        >
          <span className="text-5xl">✅</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <p className="text-white/80 text-sm">Amount Transferred</p>
          <p className="text-white font-black text-5xl mt-1">₹420</p>
          <p className="text-white/90 text-sm mt-2">{user?.upiId || '9876543210@upi'}</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
            <span className="text-white/70 text-xs">Transferred in 3.2 seconds</span>
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </div>

      <div className="px-5 py-5">
        {/* Receipt Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          {/* Dashed divider */}
          <div className="p-4 border-b border-dashed border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold" style={{ color: '#2E1065' }}>Payment Receipt</p>
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2E106510' }}>
                  <Shield size={16} style={{ color: '#2E1065' }} />
                </div>
                <span className="text-xs font-bold" style={{ color: '#2E1065' }}>GigShield</span>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Claim ID', val: '#CLM-2026-0421' },
                { label: 'Trigger', val: '🌧️ Heavy Rain >50mm (IMD)' },
                { label: 'Plan', val: '🥇 Gold Shield' },
                { label: 'Zone', val: `${user?.city || 'Chennai'} — ${user?.pincode || '600001'}` },
                { label: 'Date', val: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{row.label}</span>
                  <span className="font-medium text-gray-700">{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-between px-4 -my-2">
            {Array(14).fill(null).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-[#F8FAFC]" />
            ))}
          </div>

          <div className="p-4">
            <div className="flex justify-between font-bold">
              <span style={{ color: '#2E1065' }}>Total Paid Out</span>
              <span style={{ color: '#10B981' }}>₹420</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Zero-touch parametric claim · No documents needed</p>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <p className="font-semibold text-sm mb-4" style={{ color: '#2E1065' }}>Payout Timeline</p>
          <div className="space-y-4">
            {timeline.map((step, i) => (
              <div key={i} className="flex items-start gap-3 relative">
                {i < timeline.length - 1 && (
                  <div className="absolute left-4 top-6 bottom-0 w-px bg-green-100" />
                )}
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 z-10 text-sm">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-700 font-medium">{step.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{step.time}</p>
                </div>
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
            <p className="text-xs text-purple-400">Total Claims Received</p>
            <p className="font-bold text-xl mt-1" style={{ color: '#2E1065' }}>₹{totalPaid.toLocaleString()}</p>
            <p className="text-xs text-purple-400 mt-0.5">All-time via GigShield</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <p className="text-xs text-green-500">Processing Time</p>
            <p className="font-bold text-xl mt-1 text-green-700">3.2s</p>
            <p className="text-xs text-green-400 mt-0.5">Industry avg: 7–14 days</p>
          </div>
        </div>

        {/* Rating */}
        {!rated ? (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
            <p className="font-semibold text-sm mb-1" style={{ color: '#2E1065' }}>Rate this experience</p>
            <p className="text-xs text-gray-400 mb-3">How was your claim payout experience?</p>
            <div className="flex gap-2 justify-center mb-3">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setRating(s)}
                  className="transition-transform active:scale-90">
                  <Star size={28} fill={s <= rating ? '#EAB308' : 'none'} stroke={s <= rating ? '#EAB308' : '#D1D5DB'} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <button onClick={() => setRated(true)}
                className="w-full py-2.5 rounded-xl text-white text-sm font-medium"
                style={{ background: '#2E1065' }}>
                Submit Rating
              </button>
            )}
          </div>
        ) : (
          <div className="bg-green-50 rounded-2xl p-3 border border-green-100 mb-4 text-center">
            <p className="text-green-700 text-sm font-medium">🙏 Thank you for your feedback!</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mb-4">
          <button className="flex-1 py-3 rounded-2xl border-2 font-medium flex items-center justify-center gap-2 text-sm"
            style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>
            <Download size={14} /> Download
          </button>
          <button className="flex-1 py-3 rounded-2xl border-2 font-medium flex items-center justify-center gap-2 text-sm"
            style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>
            <Share2 size={14} /> Share
          </button>
        </div>

        <button onClick={() => navigate('/app/dashboard')}
          className="w-full py-4 rounded-2xl text-white font-bold mb-6"
          style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}