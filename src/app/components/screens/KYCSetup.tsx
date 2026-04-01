import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Shield, CheckCircle, User, MapPin, Cpu, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

const riskFactors = [
  { label: 'Rain Exposure (Chennai South)', score: 78, color: '#3B82F6' },
  { label: 'App Downtime History', score: 45, color: '#F59E0B' },
  { label: 'Peak Hour Risk', score: 62, color: '#8B5CF6' },
  { label: 'AQI Zone', score: 55, color: '#10B981' },
];

export function KYCSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setAuthenticated } = useApp();
  const phone = (location.state as any)?.phone || '9876543210';

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<'zomato' | 'swiggy'>('zomato');
  const [workerId, setWorkerId] = useState('');
  const [city, setCity] = useState('Chennai');
  const [pincode, setPincode] = useState('600001');
  const [upiId, setUpiId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerateProfile = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2500);
  };

  const handleContinue = () => {
    setUser({
      phone,
      name: name || 'Rajesh Kumar',
      platform,
      workerId: workerId || 'ZOM-CH-9284',
      riskScore: 64,
      city,
      pincode,
      upiId: upiId || `${phone}@upi`,
      totalEarnings: 182400,
      deliveries: 1847,
      memberSince: 'Jan 2025',
    });
    setAuthenticated(true);
    navigate('/premium');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="px-5 pt-6 pb-4" style={{ background: 'linear-gradient(135deg, #2E1065, #4C1D95)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <span className="text-white font-semibold">GigShield</span>
        </div>
        <h1 className="text-white text-xl font-bold">Setup Your Profile</h1>
        <p className="text-purple-200 text-sm mt-1">Takes less than 2 minutes</p>

        {/* Progress */}
        <div className="flex gap-2 mt-4">
          {['Personal', 'Platform', 'AI Risk'].map((s, i) => (
            <div key={s} className="flex-1 flex flex-col gap-1">
              <div className="h-1 rounded-full" style={{ background: i <= step ? '#A78BFA' : 'rgba(255,255,255,0.2)' }} />
              <span className="text-xs text-purple-200/70">{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-5">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <User size={16} style={{ color: '#2E1065' }} />
                  </div>
                  <h3 className="font-semibold" style={{ color: '#2E1065' }}>Personal Details</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Rajesh Kumar"
                      className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-[#2E1065] transition-colors text-gray-800"
                      style={{ borderColor: '#E2E8F0' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Mobile Number</label>
                    <div className="flex items-center gap-2 border-2 rounded-xl px-4 py-3" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                      <span className="text-gray-500 text-sm">+91 {phone}</span>
                      <CheckCircle size={14} className="ml-auto text-[#10B981]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder={`${phone}@upi`}
                      className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-[#2E1065] transition-colors text-gray-800"
                      style={{ borderColor: '#E2E8F0' }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <MapPin size={16} style={{ color: '#2E1065' }} />
                  </div>
                  <h3 className="font-semibold" style={{ color: '#2E1065' }}>Location</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <select value={city} onChange={e => setCity(e.target.value)}
                      className="w-full border-2 rounded-xl px-3 py-3 outline-none focus:border-[#2E1065] text-gray-800 bg-white"
                      style={{ borderColor: '#E2E8F0' }}>
                      {['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Kolkata'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      maxLength={6}
                      className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-[#2E1065] transition-colors text-gray-800"
                      style={{ borderColor: '#E2E8F0' }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(1)}
                disabled={!city}
                className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}
              >
                Next <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                <h3 className="font-semibold mb-4" style={{ color: '#2E1065' }}>Select Your Delivery Platform</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { id: 'zomato', name: 'Zomato', color: '#E23744', emoji: '🍕', placeholder: 'ZOM-CH-XXXX' },
                    { id: 'swiggy', name: 'Swiggy', color: '#FC8019', emoji: '🛵', placeholder: 'SWG-CH-XXXX' },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id as any)}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all"
                      style={{
                        borderColor: platform === p.id ? p.color : '#E2E8F0',
                        background: platform === p.id ? `${p.color}10` : 'white',
                      }}
                    >
                      <span className="text-3xl">{p.emoji}</span>
                      <span className="font-semibold text-sm" style={{ color: platform === p.id ? p.color : '#64748B' }}>{p.name}</span>
                      {platform === p.id && <CheckCircle size={14} style={{ color: p.color }} />}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Worker ID</label>
                  <input
                    type="text"
                    value={workerId}
                    onChange={e => setWorkerId(e.target.value)}
                    placeholder={platform === 'zomato' ? 'ZOM-CH-9284' : 'SWG-CH-7391'}
                    className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-[#2E1065] transition-colors text-gray-800"
                    style={{ borderColor: '#E2E8F0' }}
                  />
                </div>
              </div>

              <div className="bg-[#EFF6FF] rounded-2xl p-4 mb-5 border border-blue-100">
                <p className="text-blue-800 text-sm font-medium mb-1">🔒 Secure Connection</p>
                <p className="text-blue-600 text-xs">Your {platform === 'zomato' ? 'Zomato' : 'Swiggy'} data is only used to verify work status during claim events. We never store order details.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 py-4 rounded-2xl font-semibold border-2 text-[#2E1065]" style={{ borderColor: '#E2E8F0' }}>Back</button>
                <button onClick={() => setStep(2)} className="flex-1 py-4 rounded-2xl text-white font-semibold" style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Cpu size={16} style={{ color: '#2E1065' }} />
                  </div>
                  <h3 className="font-semibold" style={{ color: '#2E1065' }}>AI Risk Profile</h3>
                </div>

                {!generated && !generating && (
                  <div className="text-center py-6">
                    <div className="text-5xl mb-3">🤖</div>
                    <p className="text-gray-600 text-sm mb-5">Our AI will analyze weather patterns, platform data, and your work history to generate a personalized risk profile.</p>
                    <button
                      onClick={handleGenerateProfile}
                      className="px-8 py-3 rounded-2xl text-white font-semibold"
                      style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}
                    >
                      🔮 Generate AI Risk Profile
                    </button>
                  </div>
                )}

                {generating && (
                  <div className="text-center py-6">
                    <div className="text-5xl mb-3 animate-bounce">🤖</div>
                    <p className="text-[#2E1065] font-semibold mb-3">Analyzing your risk profile...</p>
                    <div className="space-y-2">
                      {['Fetching IMD weather data...', 'Analyzing city risk zone...', 'Processing platform history...', 'Calculating premiums...'].map((t, i) => (
                        <motion.div key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }}
                          className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                          {t}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {generated && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Overall Risk Score</p>
                        <div className="flex items-end gap-1">
                          <span className="text-4xl font-bold" style={{ color: '#F59E0B' }}>64</span>
                          <span className="text-gray-400 text-sm mb-1">/100</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#FEF3C7', color: '#B45309' }}>Moderate Risk</span>
                      </div>
                      <div className="w-20 h-20 relative">
                        <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EAB308" strokeWidth="3"
                            strokeDasharray={`${64} ${100 - 64}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Shield size={18} style={{ color: '#EAB308' }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {riskFactors.map(f => (
                        <div key={f.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">{f.label}</span>
                            <span className="font-medium" style={{ color: f.color }}>{f.score}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${f.score}%` }}
                              transition={{ delay: 0.3, duration: 0.8 }}
                              className="h-full rounded-full" style={{ background: f.color }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
                      <p className="text-amber-800 text-xs font-medium">⚠️ Monsoon season detected</p>
                      <p className="text-amber-600 text-xs mt-0.5">Chennai South shows elevated flood risk for next 4 weeks. Consider Gold Shield.</p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-2xl font-semibold border-2 text-[#2E1065]" style={{ borderColor: '#E2E8F0' }}>Back</button>
                <button
                  onClick={handleContinue}
                  disabled={!generated}
                  className="flex-1 py-4 rounded-2xl text-white font-semibold disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}
                >
                  Choose Plan →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}