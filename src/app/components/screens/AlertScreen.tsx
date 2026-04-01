import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, ChevronRight, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

const alerts = [
  {
    id: 1,
    type: 'Heavy Rain',
    icon: '🌧️',
    severity: 'critical',
    title: 'Heavy Rain Alert: Chennai South',
    subtitle: '>50mm detected by IMD Station — Zomato deliveries paused',
    coverage: '₹420/day',
    detail: 'IMD has confirmed rainfall of 52mm in your zone (600001). This triggers your Gold Shield parametric clause. No action needed.',
    triggered: true,
    time: '14:23',
  },
  {
    id: 2,
    type: 'AQI Alert',
    icon: '💨',
    severity: 'moderate',
    title: 'AQI Moderate: 165 (Unhealthy)',
    subtitle: 'Approaching your Gold Shield threshold of 150',
    coverage: 'Monitoring',
    detail: 'Air quality in your zone is elevated. Your Gold Shield activates at AQI 150. Current: 165.',
    triggered: false,
    time: '13:45',
  },
];

const steps = [
  { label: 'Trigger Confirmed (IMD API)', done: true },
  { label: 'Location Validated (Pincode 600001)', done: true },
  { label: 'Platform Outage Verified', done: true },
  { label: 'Fraud Check Passed', done: true },
  { label: 'Payout Processing...', done: false, loading: true },
];

export function AlertScreen() {
  const navigate = useNavigate();
  const { user, selectedTier, setAlertActive, language } = useApp();
  const [showPayout, setShowPayout] = useState(false);
  const [step, setStep] = useState(0);
  const [payoutDone, setPayoutDone] = useState(false);

  useEffect(() => {
    if (showPayout && step < steps.length) {
      const timer = setTimeout(() => {
        setStep(s => {
          if (s >= steps.length - 1) {
            setTimeout(() => setPayoutDone(true), 600);
            return s;
          }
          return s + 1;
        });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [showPayout, step]);

  const t = (en: string, hi: string) => language === 'hi' ? hi : en;

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      {/* Alert Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: 'linear-gradient(135deg, #991B1B, #DC2626)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <span className="text-white font-bold">LIVE ALERTS</span>
          <span className="ml-auto text-white/70 text-xs">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-white/15 rounded-2xl p-4 border border-white/30"
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">🌧️</span>
            <div>
              <p className="text-white font-bold">Heavy Rain Alert: Chennai South</p>
              <p className="text-white/80 text-sm mt-0.5">&gt;50mm detected · Zomato deliveries paused</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full text-white font-bold" style={{ background: '#10B981' }}>
                  ✓ Coverage Active
                </span>
                <span className="text-white text-xs">₹420/day</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-5 py-4">
        {/* Active Alerts */}
        <h3 className="font-semibold text-sm mb-3" style={{ color: '#2E1065' }}>Active Alerts</h3>
        <div className="space-y-3 mb-4">
          {alerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: alert.severity === 'critical' ? '#EF4444' : '#F59E0B' }}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: alert.severity === 'critical' ? '#FEE2E2' : '#FEF3C7' }}>
                    {alert.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm" style={{ color: alert.severity === 'critical' ? '#991B1B' : '#92400E' }}>
                        {alert.title}
                      </p>
                      <span className="text-xs text-gray-400">{alert.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{alert.subtitle}</p>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{alert.detail}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: alert.triggered ? '#DCFCE7' : '#FEF3C7',
                          color: alert.triggered ? '#166534' : '#92400E',
                        }}>
                        {alert.triggered ? `✓ Payout: ${alert.coverage}` : `⚠ ${alert.coverage}`}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: '#F3F4F6', color: '#374151' }}>
                        {alert.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Relax Message */}
        <div className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm mb-4" style={{ background: '#F0FDF4' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">😌</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#166534' }}>
                {t('Relax — You\'re covered!', 'आराम करें — आप सुरक्षित हैं!')}
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                {t('Your ₹420/day Gold Shield coverage is active. Stay safe at home.', 'आपकी ₹420/दिन गोल्ड शील्ड कवरेज सक्रिय है।')}
              </p>
            </div>
          </div>
        </div>

        {/* Trigger Payout Button */}
        {!showPayout && (
          <button
            onClick={() => setShowPayout(true)}
            className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
          >
            <Zap size={18} fill="white" /> {t('Claim Instant Payout — ₹420', 'तत्काल भुगतान — ₹420')}
          </button>
        )}

        {/* Payout Flow */}
        <AnimatePresence>
          {showPayout && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
              <div className="p-4 border-b border-gray-50">
                <p className="font-semibold" style={{ color: '#2E1065' }}>Zero-Touch Payout Verification</p>
                <p className="text-xs text-gray-500 mt-0.5">Automated · No forms · No waiting</p>
              </div>
              <div className="p-4">
                {steps.slice(0, step + 1).map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: (i < step || (i === step && !s.loading)) ? '#10B981' : '#F3F4F6' }}>
                      {i < step || (i === step && !s.loading) ? (
                        <CheckCircle size={14} className="text-white" />
                      ) : s.loading ? (
                        <div className="w-3 h-3 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <span className="text-xs" style={{ color: i <= step ? '#374151' : '#9CA3AF' }}>{s.label}</span>
                  </motion.div>
                ))}

                {payoutDone && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                    className="mt-4">
                    <div className="text-center py-4">
                      <div className="text-5xl mb-2">✅</div>
                      <p className="font-bold text-green-700 text-lg">Payout Successful!</p>
                      <p className="text-green-600 text-sm mt-1">₹420 → {user?.upiId || '9876543210@upi'}</p>
                      <p className="text-gray-400 text-xs mt-2">Transferred in 3.2 seconds</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); navigate('/app/payout'); }}
                      className="w-full py-3 rounded-xl text-white font-semibold mt-2"
                      style={{ background: '#10B981' }}
                    >
                      View Receipt →
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        <button onClick={() => navigate('/app/claims')}
          className="w-full py-3 rounded-2xl border-2 font-medium flex items-center justify-center gap-2 text-sm mb-4"
          style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>
          View All Claims History <ChevronRight size={16} />
        </button>

        <button onClick={() => { setAlertActive(false); navigate('/app/dashboard'); }}
          className="w-full py-3 rounded-2xl text-sm text-gray-400 flex items-center justify-center gap-1">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}