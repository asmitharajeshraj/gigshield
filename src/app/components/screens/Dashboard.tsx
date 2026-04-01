import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Zap, TrendingUp, Bell, ChevronRight, RefreshCw, AlertTriangle, Wind, Thermometer, Droplets, Wifi } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

const triggerData = [
  { icon: '🌧️', label: 'IMD Rain', value: '20mm', threshold: '15mm', status: 'warning', color: '#3B82F6', progress: 67 },
  { icon: '💨', label: 'AQI Index', value: '150', threshold: '150', status: 'active', color: '#EF4444', progress: 100 },
  { icon: '🌡️', label: 'Temperature', value: '38°C', threshold: '42°C', status: 'safe', color: '#10B981', progress: 45 },
  { icon: '📱', label: 'Zomato Status', value: 'Online', threshold: '—', status: 'safe', color: '#10B981', progress: 100 },
];

const recentActivity = [
  { date: 'Today, 9:15 AM', text: 'Policy auto-renewed for this week', type: 'info' },
  { date: 'Yesterday', text: '₹420 payout processed for Rain event', type: 'success' },
  { date: '2 days ago', text: 'AQI Alert: Chennai South — monitoring', type: 'warning' },
  { date: 'Last week', text: 'Bronze → Gold Shield upgrade applied', type: 'info' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { user, selectedTier, alertActive, setAlertActive, language, claims } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const tier = selectedTier || 'gold';
  const tierConfig = {
    gold: { label: '🥇 Gold Shield', color: '#EAB308', bg: 'linear-gradient(135deg, #78350F, #B45309)', payout: 4000, premium: 115 },
    silver: { label: '🥈 Silver Shield', color: '#94A3B8', bg: 'linear-gradient(135deg, #334155, #64748B)', payout: 2500, premium: 59 },
    bronze: { label: '🥉 Bronze Shield', color: '#D97706', bg: 'linear-gradient(135deg, #92400E, #B45309)', payout: 1200, premium: 29 },
  }[tier];

  const t = (en: string, hi: string) => language === 'hi' ? hi : en;

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="px-5 pt-4 pb-6" style={{ background: tierConfig.bg }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-xs">{t('Welcome back', 'स्वागत है')}</p>
            <h2 className="text-white font-bold">{user?.name || 'Rajesh Kumar'} 👋</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <RefreshCw size={14} className={`text-white ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => navigate('/app/alerts')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center relative">
              <Bell size={14} className="text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-400 rounded-full" />
            </button>
          </div>
        </div>

        {/* Shield Status Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-white font-semibold">{tierConfig.label}</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ background: '#10B981' }}>
              {t('ACTIVE', 'सक्रिय')}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t('Max Payout', 'अधिकतम'), val: `₹${tierConfig.payout.toLocaleString()}` },
              { label: t('Premium', 'प्रीमियम'), val: `₹${tierConfig.premium}/wk` },
              { label: t('Valid Till', 'वैध तक'), val: 'Sunday' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-white/60 text-xs">{s.label}</p>
                <p className="text-white font-bold text-sm">{s.val}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="px-5 -mt-3">
        {/* Alert Banner */}
        {alertActive ? (
          <motion.button
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={() => navigate('/app/alert')}
            className="w-full mb-4 p-4 rounded-2xl border-2 text-left flex items-center gap-3 shadow-lg"
            style={{ background: '#FEF2F2', borderColor: '#EF4444' }}
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} style={{ color: '#EF4444' }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-red-700">🌧️ Heavy Rain Alert Active!</p>
              <p className="text-red-500 text-xs">Your ₹420/day coverage is active. Tap for details.</p>
            </div>
            <ChevronRight size={16} style={{ color: '#EF4444' }} />
          </motion.button>
        ) : (
          <button
            onClick={() => { setAlertActive(true); navigate('/app/alert'); }}
            className="w-full mb-4 p-3 rounded-2xl border-2 text-left flex items-center gap-3"
            style={{ background: '#F0FDF4', borderColor: '#10B981' }}
          >
            <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Shield size={16} style={{ color: '#10B981' }} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-700 text-sm">{t('All systems normal', 'सभी सिस्टम सामान्य')}</p>
              <p className="text-green-500 text-xs">{t('No active triggers — you\'re covered', 'कोई सक्रिय ट्रिगर नहीं')}</p>
            </div>
            <span className="text-xs text-green-500 font-medium">{t('Simulate →', 'सिम्युलेट →')}</span>
          </button>
        )}

        {/* Live Trigger Monitor */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={16} style={{ color: '#2E1065' }} />
              <span className="font-semibold text-sm" style={{ color: '#2E1065' }}>{t('Live Trigger Monitor', 'लाइव ट्रिगर मॉनिटर')}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <Wifi size={10} />
              <span>{t('Live', 'लाइव')}</span>
            </div>
          </div>
          <div className="space-y-3">
            {triggerData.map(trig => (
              <div key={trig.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{trig.icon}</span>
                    <span className="text-xs text-gray-600">{trig.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: trig.color }}>{trig.value}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        background: trig.status === 'safe' ? '#DCFCE7' : trig.status === 'warning' ? '#FEF3C7' : '#FEE2E2',
                        color: trig.status === 'safe' ? '#166534' : trig.status === 'warning' ? '#92400E' : '#991B1B',
                      }}>
                      {trig.status === 'safe' ? '✓ Safe' : trig.status === 'warning' ? '⚠ Near' : '🔴 Hit'}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${trig.progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: trig.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: t('Total Earned', 'कुल कमाया'), val: `₹${user?.totalEarnings?.toLocaleString() || '1,82,400'}`, icon: '💰', color: '#10B981' },
            { label: t('Deliveries', 'डिलीवरी'), val: (user?.deliveries || 1847).toLocaleString(), icon: '🛵', color: '#3B82F6' },
            { label: t('Claims Paid', 'भुगतान'), val: `₹${claims.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0).toLocaleString()}`, icon: '⚡', color: '#8B5CF6' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
              <span className="text-xl">{stat.icon}</span>
              <p className="font-bold text-sm mt-1" style={{ color: stat.color }}>{stat.val}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-semibold text-sm mb-3" style={{ color: '#2E1065' }}>{t('Quick Actions', 'त्वरित क्रियाएं')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: t('My Policy', 'मेरी पॉलिसी'), icon: '🛡️', onClick: () => navigate('/app/policy') },
              { label: t('Premium Calc', 'प्रीमियम कैलक'), icon: '🔢', onClick: () => navigate('/app/premium-calc') },
              { label: t('View Claims', 'दावे देखें'), icon: '📋', onClick: () => navigate('/app/claims') },
              { label: t('Change Plan', 'प्लान बदलें'), icon: '🔄', onClick: () => navigate('/premium') },
              { label: t('Simulate Alert', 'अलर्ट सिम्युलेट'), icon: '🌧️', onClick: () => { setAlertActive(true); navigate('/app/alert'); } },
              { label: t('My Profile', 'मेरी प्रोफाइल'), icon: '👤', onClick: () => navigate('/app/profile') },
            ].map(action => (
              <button key={action.label} onClick={action.onClick}
                className="flex items-center gap-2 p-3 rounded-xl border text-left transition-all active:scale-[0.97]"
                style={{ borderColor: '#E2E8F0' }}>
                <span className="text-lg">{action.icon}</span>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm" style={{ color: '#2E1065' }}>{t('Recent Activity', 'हाल की गतिविधि')}</h3>
            <button onClick={() => navigate('/app/claims')} className="text-xs font-medium" style={{ color: '#7C3AED' }}>{t('View All', 'सभी देखें')}</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center"
                  style={{ background: a.type === 'success' ? '#DCFCE7' : a.type === 'warning' ? '#FEF3C7' : '#EFF6FF' }}>
                  <div className="w-2 h-2 rounded-full"
                    style={{ background: a.type === 'success' ? '#10B981' : a.type === 'warning' ? '#F59E0B' : '#3B82F6' }} />
                </div>
                <div>
                  <p className="text-xs text-gray-700">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Widget */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white/70 text-xs">{user?.city || 'Chennai'}, {user?.pincode || '600001'}</p>
                <p className="text-white font-bold">Today's Forecast</p>
              </div>
              <span className="text-3xl">⛈️</span>
            </div>
            <div className="flex gap-4">
              {[
                { icon: <Droplets size={12} />, val: '68mm', label: 'Rain' },
                { icon: <Wind size={12} />, val: '32 km/h', label: 'Wind' },
                { icon: <Thermometer size={12} />, val: '32°C', label: 'Temp' },
              ].map(w => (
                <div key={w.label} className="flex items-center gap-1 text-white/80">
                  {w.icon}
                  <div>
                    <p className="text-xs font-bold text-white">{w.val}</p>
                    <p className="text-xs text-white/60">{w.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 p-2 rounded-xl bg-white/10 text-center">
              <p className="text-white text-xs font-medium">⚠️ Heavy rain expected 2PM–7PM · {t('Your coverage is active!', 'आपकी कवरेज सक्रिय है!')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}