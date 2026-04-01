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
    // ✅ FIXED (safe string for build)
    subtitle: '> 50mm detected by IMD Station — Zomato deliveries paused',
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
  const { user, setAlertActive, language } = useApp();

  const [showPayout, setShowPayout] = useState(false);
  const [step, setStep] = useState(0);
  const [payoutDone, setPayoutDone] = useState(false);

  useEffect(() => {
    if (showPayout && step < steps.length) {
      const timer = setTimeout(() => {
        setStep((s) => {
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

  const t = (en: string, hi: string) => (language === 'hi' ? hi : en);

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      
      {/* HEADER */}
      <div className="px-5 pt-4 pb-5 bg-gradient-to-r from-red-800 to-red-600">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <span className="text-white font-bold">LIVE ALERTS</span>
          <span className="ml-auto text-white/70 text-xs">
            {new Date().toLocaleTimeString()}
          </span>
        </div>

        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-white/15 rounded-2xl p-4 border border-white/30"
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">🌧️</span>
            <div>
              <p className="text-white font-bold">
                Heavy Rain Alert: Chennai South
              </p>

              {/* ✅ SAFE JSX */}
              <p className="text-white/80 text-sm mt-0.5">
                &gt;50mm detected · Zomato deliveries paused
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full text-white font-bold bg-green-500">
                  ✓ Coverage Active
                </span>
                <span className="text-white text-xs">₹420/day</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="px-5 py-4">

        {/* ALERT LIST */}
        <h3 className="font-semibold text-sm mb-3 text-purple-900">
          Active Alerts
        </h3>

        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white rounded-2xl p-4 mb-3 border">
            <p className="font-semibold">{alert.title}</p>
            <p className="text-xs text-gray-500 mt-1">{alert.subtitle}</p>
            <p className="text-xs mt-2">{alert.detail}</p>
          </div>
        ))}

        {/* RELAX MESSAGE */}
        <div className="bg-green-50 p-4 rounded-2xl mb-4">
          <p className="font-semibold text-green-700">
            {t("Relax — You're covered!", "आराम करें")}
          </p>
        </div>

        {/* BUTTON */}
        {!showPayout && (
          <button
            onClick={() => setShowPayout(true)}
            className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold"
          >
            Claim Instant Payout — ₹420
          </button>
        )}

        {/* PAYOUT FLOW */}
        <AnimatePresence>
          {showPayout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-4 rounded-2xl mt-4"
            >
              {steps.slice(0, step + 1).map((s, i) => (
                <p key={i} className="text-xs mb-2">
                  {s.label}
                </p>
              ))}

              {payoutDone && (
                <div className="text-center mt-4">
                  <p className="text-green-600 font-bold">
                    ✅ Payout Successful!
                  </p>
                  <p className="text-sm">
                    ₹420 → {user?.upiId || 'demo@upi'}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION */}
        <button
          onClick={() => navigate('/app/dashboard')}
          className="w-full mt-4 text-gray-400"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
