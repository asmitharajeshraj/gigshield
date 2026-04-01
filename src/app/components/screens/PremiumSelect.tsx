import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, CheckCircle, Zap, Star, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

const tiers = [
  {
    id: 'bronze',
    name: 'Bronze Shield',
    nameHi: 'कांस्य शील्ड',
    emoji: '🥉',
    premium: 29,
    payout: 1200,
    color: '#B45309',
    bg: '#FEF3C7',
    border: '#D97706',
    description: 'Basic protection for calm weather periods',
    descriptionHi: 'शांत मौसम के लिए बुनियादी सुरक्षा',
    features: ['Rain >35mm', 'AQI >300', '₹1,200/day payout', 'Manual claim'],
    featuresHi: ['बारिश >35mm', 'AQI >300', '₹1,200/दिन भुगतान', 'मैनुअल दावा'],
    breakdown: null,
  },
  {
    id: 'silver',
    name: 'Silver Shield',
    nameHi: 'सिल्वर शील्ड',
    emoji: '🥈',
    premium: 59,
    payout: 2500,
    color: '#475569',
    bg: '#F1F5F9',
    border: '#64748B',
    description: 'Enhanced coverage with faster payouts',
    descriptionHi: 'तेज़ भुगतान के साथ बेहतर कवरेज',
    features: ['Rain >25mm', 'AQI >200', 'App Crash 2h+', '₹2,500/day payout', 'Auto claim'],
    featuresHi: ['बारिश >25mm', 'AQI >200', 'ऐप क्रैश 2h+', '₹2,500/दिन भुगतान', 'ऑटो दावा'],
    breakdown: null,
  },
  {
    id: 'gold',
    name: 'Gold Shield',
    nameHi: 'गोल्ड शील्ड',
    emoji: '🥇',
    premium: 115,
    payout: 4000,
    color: '#B45309',
    bg: '#FFFBEB',
    border: '#EAB308',
    description: 'Maximum AI-powered parametric protection',
    descriptionHi: 'AI-संचालित पैरामीट्रिक सुरक्षा',
    features: ['Rain >15mm', 'Heat >42°C', 'AQI >150', 'Curfew', 'App Crash 1h+', '₹4,000/day payout', 'Zero-touch instant payout'],
    featuresHi: ['बारिश >15mm', 'गर्मी >42°C', 'AQI >150', 'कर्फ्यू', 'ऐप क्रैश 1h+', '₹4,000/दिन भुगतान', 'ज़ीरो-टच इंस्टेंट भुगतान'],
    breakdown: {
      base: 99,
      floodRisk: 14,
      season: 8,
      discount: -6,
      total: 115,
    },
    recommended: true,
  },
];

export function PremiumSelect() {
  const navigate = useNavigate();
  const { setSelectedTier, language, setLanguage, user } = useApp();
  const [selected, setSelected] = useState<string>('gold');
  const [expanded, setExpanded] = useState<string | null>('gold');
  const [loading, setLoading] = useState(false);

  const t = (en: string, hi: string) => language === 'hi' ? hi : en;

  const handleConfirm = () => {
    setLoading(true);
    setSelectedTier(selected as any);
    setTimeout(() => {
      setLoading(false);
      navigate('/app/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="px-5 pt-6 pb-5" style={{ background: 'linear-gradient(135deg, #2E1065, #4C1D95)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-white" />
            <span className="text-white font-semibold">GigShield</span>
          </div>
          {/* Language Toggle */}
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

        {/* Risk Forecast Alert */}
        <div className="bg-orange-500/20 rounded-2xl p-3 border border-orange-400/30">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-orange-300" />
            <span className="text-orange-200 text-xs font-semibold">
              {t("Next Week's Risk Forecast", "अगले हफ्ते का जोखिम पूर्वानुमान")}
            </span>
          </div>
          <p className="text-orange-100 text-sm font-bold">
            {t("🌧️ Monsoon Warning — Chennai South", "🌧️ मानसून चेतावनी — चेन्नई दक्षिण")}
          </p>
          <div className="flex gap-3 mt-2">
            {[
              { label: 'IMD Forecast', val: '68mm rain' },
              { label: 'AQI', val: '165 (Mod)' },
              { label: 'Risk', val: 'HIGH' },
            ].map(s => (
              <div key={s.label} className="text-xs">
                <span className="text-orange-300/70">{s.label}: </span>
                <span className="text-orange-200 font-semibold">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        <h2 className="font-bold text-[#2E1065] mb-1">{t('Choose Your Shield', 'अपनी शील्ड चुनें')}</h2>
        <p className="text-gray-500 text-xs mb-4">{t('AI-priced for your city & work pattern', 'आपके शहर और काम के पैटर्न के लिए AI मूल्य')}</p>

        <div className="space-y-3 mb-5">
          {tiers.map((tier, idx) => {
            const isSelected = selected === tier.id;
            const isExpanded = expanded === tier.id;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => { setSelected(tier.id); setExpanded(isExpanded ? null : tier.id); }}
                className="rounded-2xl border-2 overflow-hidden cursor-pointer transition-all"
                style={{
                  borderColor: isSelected ? tier.border : '#E2E8F0',
                  background: isSelected ? tier.bg : 'white',
                  boxShadow: isSelected ? `0 0 0 1px ${tier.border}40` : 'none',
                }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tier.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold" style={{ color: tier.color }}>{t(tier.name, tier.nameHi)}</span>
                          {tier.recommended && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white flex items-center gap-1"
                              style={{ background: '#EAB308' }}>
                              <Star size={8} fill="white" /> {t('AI Pick', 'AI पिक')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{t(tier.description, tier.descriptionHi)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-bold" style={{ color: tier.color }}>₹{tier.premium}<span className="text-xs font-normal text-gray-400">/wk</span></div>
                        <div className="text-xs text-gray-500">↑ ₹{tier.payout.toLocaleString()}/day</div>
                      </div>
                      {isSelected ? <CheckCircle size={18} style={{ color: tier.border }} /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          {/* Features */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {(language === 'hi' ? tier.featuresHi : tier.features).map(f => (
                              <span key={f} className="px-2 py-0.5 rounded-full text-xs" style={{ background: `${tier.border}20`, color: tier.color }}>
                                ✓ {f}
                              </span>
                            ))}
                          </div>

                          {/* Gold breakdown */}
                          {tier.breakdown && (
                            <div className="bg-white rounded-xl p-3 border" style={{ borderColor: `${tier.border}30` }}>
                              <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                                <Zap size={10} style={{ color: '#EAB308' }} /> {t('AI Dynamic Pricing Breakdown', 'AI डायनामिक प्राइसिंग')}
                              </p>
                              <div className="space-y-1">
                                {[
                                  { label: t('Base Premium', 'बेस प्रीमियम'), val: `+₹${tier.breakdown.base}` },
                                  { label: t('Flood Risk Add-on', 'बाढ़ जोखिम'), val: `+₹${tier.breakdown.floodRisk}`, color: '#EF4444' },
                                  { label: t('Monsoon Season', 'मानसून सीजन'), val: `+₹${tier.breakdown.season}`, color: '#F59E0B' },
                                  { label: t('Loyalty Discount', 'लॉयल्टी छूट'), val: `-₹${Math.abs(tier.breakdown.discount)}`, color: '#10B981' },
                                ].map(row => (
                                  <div key={row.label} className="flex justify-between text-xs">
                                    <span className="text-gray-500">{row.label}</span>
                                    <span className="font-medium" style={{ color: row.color || '#374151' }}>{row.val}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between text-xs pt-1 border-t border-gray-100 font-bold">
                                  <span style={{ color: '#2E1065' }}>{t('Total Weekly', 'कुल साप्ताहिक')}</span>
                                  <span style={{ color: '#B45309' }}>₹{tier.breakdown.total}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button className="w-full flex items-center justify-center gap-1 py-1.5 bg-gray-50/80 text-xs text-gray-400 border-t border-gray-100"
                  onClick={e => { e.stopPropagation(); setExpanded(isExpanded ? null : tier.id); }}>
                  {isExpanded ? <><ChevronUp size={12} /> Less</> : <><ChevronDown size={12} /> Details</>}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* UPI AutoPay */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">💳</div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: '#2E1065' }}>UPI AutoPay Setup</p>
              <p className="text-xs text-gray-400">{user?.upiId || '9876543210@upi'} · Weekly auto-debit</p>
            </div>
            <div className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#DCFCE7', color: '#166534' }}>✓ Ready</div>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}
        >
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('Activating Shield...', 'शील्ड सक्रिय हो रही है...')}</>
          ) : (
            <>{t('Activate Shield & Pay', 'शील्ड सक्रिय करें')} ₹{tiers.find(t => t.id === selected)?.premium}/wk</>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          {t('Cancel anytime · IRDAI Regulated · Instant payouts via UPI', 'कभी भी रद्द करें · IRDAI अनुमोदित · UPI के माध्यम से तत्काल भुगतान')}
        </p>
      </div>
    </div>
  );
}