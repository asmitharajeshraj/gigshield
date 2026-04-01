import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, ChevronRight, Edit3, LogOut, Star, Award, Phone, MapPin, CreditCard, HelpCircle, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

export function Profile() {
  const navigate = useNavigate();
  const { user, selectedTier, logout, language, setLanguage, claims } = useApp();
  const [showLogout, setShowLogout] = useState(false);

  const t = (en: string, hi: string) => language === 'hi' ? hi : en;

  const tier = selectedTier || 'gold';
  const tierConfig = {
    gold: { emoji: '🥇', label: 'Gold Shield', color: '#B45309', bg: '#FEF3C7' },
    silver: { emoji: '🥈', label: 'Silver Shield', color: '#64748B', bg: '#F1F5F9' },
    bronze: { emoji: '🥉', label: 'Bronze Shield', color: '#B45309', bg: '#FEF3C7' },
  }[tier];

  const totalClaims = claims.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
  const memberMonths = 3;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      {/* Profile Header */}
      <div className="px-5 pt-4 pb-8" style={{ background: 'linear-gradient(135deg, #2E1065, #4C1D95)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-white" />
            <span className="text-white font-semibold">GigShield</span>
          </div>
          <div className="flex items-center bg-white/10 rounded-full p-0.5">
            {(['en', 'hi'] as const).map(lang => (
              <button key={lang} onClick={() => setLanguage(lang)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{ background: language === lang ? 'white' : 'transparent', color: language === lang ? '#2E1065' : 'rgba(255,255,255,0.7)' }}>
                {lang === 'en' ? 'EN' : 'हिं'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
            👤
          </div>
          <div className="flex-1">
            <h2 className="text-white font-bold text-lg">{user?.name || 'Rajesh Kumar'}</h2>
            <p className="text-purple-200 text-sm">+91 {user?.phone || '9876543210'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: tierConfig.bg, color: tierConfig.color }}>
                {tierConfig.emoji} {tierConfig.label}
              </span>
              <span className="text-purple-200/70 text-xs">· {user?.platform === 'swiggy' ? '🛵 Swiggy' : '🍕 Zomato'}</span>
            </div>
          </div>
          <button onClick={() => navigate('/kyc')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Edit3 size={14} className="text-white" />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
            { val: `₹${totalClaims.toLocaleString()}`, label: t('Claims Paid', 'भुगतान') },
            { val: `${user?.deliveries?.toLocaleString() || '1,847'}`, label: t('Deliveries', 'डिलीवरी') },
            { val: `${memberMonths}mo`, label: t('Member', 'सदस्यता') },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center">
              <p className="text-white font-bold text-sm">{s.val}</p>
              <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 -mt-3 pb-6">
        {/* Loyalty Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Award size={20} style={{ color: '#EAB308' }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#2E1065' }}>{t('Loyalty Program', 'लॉयल्टी प्रोग्राम')}</p>
              <p className="text-xs text-gray-400">GigShield Platinum — 340 pts</p>
            </div>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#FEF3C7', color: '#B45309' }}>340 pts</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ delay: 0.3, duration: 1 }}
              className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #EAB308, #F59E0B)' }} />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">160 more points for Platinum tier → ₹20 discount</p>
        </motion.div>

        {/* Policy Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <p className="font-semibold text-sm" style={{ color: '#2E1065' }}>{t('Active Policy', 'सक्रिय पॉलिसी')}</p>
          </div>
          {[
            { icon: <Shield size={14} />, label: t('Plan', 'प्लान'), val: `${tierConfig.emoji} ${tierConfig.label}` },
            { icon: <CreditCard size={14} />, label: t('Premium', 'प्रीमियम'), val: `₹${tier === 'gold' ? 115 : tier === 'silver' ? 59 : 29}/week` },
            { icon: <Star size={14} />, label: t('Coverage', 'कवरेज'), val: `Up to ₹${tier === 'gold' ? '4,000' : tier === 'silver' ? '2,500' : '1,200'}/day` },
            { icon: <Phone size={14} />, label: 'UPI ID', val: user?.upiId || '9876543210@upi' },
            { icon: <MapPin size={14} />, label: t('Zone', 'ज़ोन'), val: `${user?.city || 'Chennai'} — ${user?.pincode || '600001'}` },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border-b border-gray-50 last:border-0">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center" style={{ color: '#2E1065' }}>
                {row.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">{row.label}</p>
                <p className="text-sm font-medium text-gray-700">{row.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <p className="font-semibold text-sm" style={{ color: '#2E1065' }}>{t('Settings & Support', 'सेटिंग्स')}</p>
          </div>
          {[
            { icon: '🔄', label: t('Change Plan', 'प्लान बदलें'), onClick: () => navigate('/premium') },
            { icon: '🔔', label: t('Notification Settings', 'सूचनाएं'), onClick: () => navigate('/app/alerts') },
            { icon: '📋', label: t('Terms & Privacy', 'नियम और शर्तें'), onClick: () => {} },
            { icon: '🤝', label: t('Refer & Earn ₹50', 'रेफर करें'), onClick: () => {} },
            { icon: '💬', label: t('Help & Support', 'सहायता'), onClick: () => {} },
            { icon: '⭐', label: t('Rate the App', 'ऐप रेट करें'), onClick: () => {} },
          ].map((item, i) => (
            <button key={i} onClick={item.onClick}
              className="w-full flex items-center gap-3 p-3.5 border-b border-gray-50 last:border-0 text-left active:bg-gray-50 transition-colors">
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1 text-sm text-gray-700">{item.label}</span>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Referral Card */}
        <div className="rounded-2xl p-4 mb-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #7C3AED, #2E1065)' }}>
          <p className="text-white font-bold mb-1">🎁 Refer & Earn</p>
          <p className="text-purple-200 text-xs mb-3">Invite delivery partners and earn ₹50 for each referral!</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2">
              <span className="text-white font-mono font-bold">GIGS-{user?.phone?.slice(-4) || '3210'}</span>
            </div>
            <button className="px-3 py-2 rounded-xl bg-white text-xs font-bold" style={{ color: '#2E1065' }}>Copy</button>
          </div>
        </div>

        {/* Admin link */}
        <button onClick={() => navigate('/admin')}
          className="w-full py-3 rounded-2xl border-2 font-medium flex items-center justify-center gap-2 text-sm mb-3"
          style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
          <ExternalLink size={14} /> Switch to Admin View
        </button>

        {/* Logout */}
        <button
          onClick={() => setShowLogout(true)}
          className="w-full py-3 rounded-2xl font-medium flex items-center justify-center gap-2 text-sm mb-6"
          style={{ background: '#FEE2E2', color: '#991B1B' }}>
          <LogOut size={14} /> {t('Sign Out', 'साइन आउट')}
        </button>

        {/* App Info */}
        <p className="text-center text-xs text-gray-300">GigShield v2.4.1 · IRDAI Reg: IRDAN182CP0022025</p>
      </div>

      {/* Logout Confirm */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setShowLogout(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-center mb-2" style={{ color: '#2E1065' }}>Sign Out?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">Your policy will remain active. You can sign back in anytime.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)} className="flex-1 py-3 rounded-2xl border-2 font-medium text-gray-600" style={{ borderColor: '#E2E8F0' }}>Cancel</button>
              <button onClick={handleLogout} className="flex-1 py-3 rounded-2xl font-medium text-white" style={{ background: '#EF4444' }}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}