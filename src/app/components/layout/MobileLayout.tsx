import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Home, FileText, Bell, User, Shield, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { path: '/app/dashboard',  icon: Home,      label: 'Home',   labelHi: 'होम' },
  { path: '/app/policy',     icon: Shield,    label: 'Policy', labelHi: 'पॉलिसी' },
  { path: '/app/claims',     icon: FileText,  label: 'Claims', labelHi: 'दावे' },
  { path: '/app/alerts',     icon: Bell,      label: 'Alerts', labelHi: 'अलर्ट' },
  { path: '/app/profile',    icon: User,      label: 'Profile',labelHi: 'प्रोफाइल' },
];

export function MobileLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, language, user } = useApp();
  const [showPWA, setShowPWA] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPWA(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (location.pathname === '/app/payout') {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1a0633 0%, #2E1065 50%, #1a0633 100%)' }}>

      {/* Desktop left decoration */}
      <div className="hidden lg:flex flex-col gap-6 mr-8 text-white/30">
        <div className="text-center">
          <Shield size={32} className="mx-auto mb-2 text-purple-400/50" />
          <p className="text-xs font-medium text-purple-300/50">GigShield PWA</p>
          <p className="text-xs text-purple-400/30">Gig Economy Insurance</p>
        </div>
        <div className="space-y-3 text-xs">
          {['⚡ Zero-Touch Payouts', '🤖 AI Fraud Detection', '🌧️ Parametric Triggers', '📍 Location Validated', '💳 UPI AutoPay'].map(f => (
            <div key={f} className="text-purple-300/40">{f}</div>
          ))}
        </div>
        <div className="text-center mt-4">
          <p className="text-purple-400/40 text-xs">Guidewire DEVTrails 2026</p>
        </div>
      </div>

      {/* Phone frame */}
      <div
        className="relative flex flex-col bg-[#F8FAFC] overflow-hidden shadow-2xl"
        style={{
          width: '100%',
          maxWidth: '390px',
          minHeight: '100vh',
          maxHeight: '100vh',
          borderRadius: 0,
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2 text-xs text-white z-10 flex-shrink-0"
          style={{ background: '#2E1065' }}>
          <span className="font-medium">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center gap-1 text-white/80">
            <div className="flex gap-0.5 items-end">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-1 rounded-sm" style={{ height: `${i * 3}px`, background: i < 4 ? 'white' : 'rgba(255,255,255,0.3)' }} />
              ))}
            </div>
            <span className="ml-1 text-xs">WiFi</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Main scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>

        {/* Bottom Nav */}
        <div className="flex items-center justify-around border-t bg-white py-2 shadow-lg flex-shrink-0"
          style={{ borderColor: '#E2E8F0' }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const label = language === 'hi' ? item.labelHi : item.label;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-0.5 px-4 py-1 relative"
              >
                {item.path === '/app/alerts' && notifications > 0 && (
                  <span className="absolute -top-0.5 right-2 w-4 h-4 rounded-full text-white flex items-center justify-center"
                    style={{ background: '#EF4444', fontSize: '9px' }}>
                    {notifications}
                  </span>
                )}
                <item.icon
                  size={20}
                  style={{ color: active ? '#2E1065' : '#94A3B8' }}
                  strokeWidth={active ? 2.5 : 1.5}
                />
                <span className="text-xs" style={{ color: active ? '#2E1065' : '#94A3B8', fontWeight: active ? 600 : 400 }}>
                  {label}
                </span>
                {active && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full" style={{ background: '#2E1065' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop right decoration */}
      <div className="hidden lg:flex flex-col gap-4 ml-8">
        <div className="bg-white/5 rounded-2xl p-4 text-white/50 text-xs max-w-[180px]">
          <p className="text-purple-300/70 font-semibold mb-2">Design System</p>
          <div className="space-y-1.5">
            {[
              { color: '#2E1065', name: 'Primary UI' },
              { color: '#EAB308', name: 'Gold Tier' },
              { color: '#64748B', name: 'Silver Tier' },
              { color: '#B45309', name: 'Bronze Tier' },
              { color: '#10B981', name: 'Safe' },
              { color: '#EF4444', name: 'Alert' },
            ].map(c => (
              <div key={c.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                <span className="text-purple-300/50">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => navigate('/admin')}
          className="px-4 py-2 rounded-xl text-xs font-medium text-center transition-all hover:bg-white/15"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
          → Admin Dashboard
        </button>
      </div>

      {/* PWA Install Prompt */}
      <AnimatePresence>
        {showPWA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border p-4 z-50"
            style={{ borderColor: '#E2E8F0', width: '340px', maxWidth: '90vw' }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#2E1065' }}>
                <Shield size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: '#2E1065' }}>Add GigShield to Home Screen</p>
                <p className="text-xs text-gray-500 mt-0.5">Get instant alerts & access your shield offline</p>
              </div>
              <button onClick={() => setShowPWA(false)} className="text-gray-300 hover:text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setShowPWA(false)} className="flex-1 py-2 rounded-xl text-xs text-gray-400 border" style={{ borderColor: '#E2E8F0' }}>
                Not Now
              </button>
              <button onClick={() => setShowPWA(false)} className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: '#2E1065' }}>
                Install App
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instant Payout Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 z-50"
            style={{ width: '340px', maxWidth: '90vw' }}
          >
            <div className="bg-[#10B981] rounded-2xl shadow-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">💸</div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">₹420 Credited to UPI</p>
                <p className="text-green-100 text-xs">{user?.upiId || '9876543210@upi'}</p>
              </div>
              <button onClick={() => setShowToast(false)}><X size={14} className="text-white/70" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}