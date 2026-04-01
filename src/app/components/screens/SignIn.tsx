import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Phone, ArrowRight, ChevronRight, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export function SignIn() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const handleSendOTP = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      const timer = setInterval(() => {
        setResendTimer(t => {
          if (t <= 1) { clearInterval(timer); return 0; }
          return t - 1;
        });
      }, 1000);
    }, 1500);
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      const el = document.getElementById(`otp-${idx + 1}`);
      el?.focus();
    }
  };

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Route to full 6-step Registration
      navigate('/register', { state: { phone } });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #2E1065 0%, #1e0a4a 60%, #0f0526 100%)' }}>
      {/* Top Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="flex flex-col items-center mb-10"
        >
          {/* Logo */}
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #4C1D95)' }}>
              <Shield className="text-white" size={40} strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight">GigShield</h1>
          <p className="text-purple-200 text-sm text-center mt-2 max-w-xs leading-relaxed">
            "They deliver your dinner.<br />We protect their livelihood."
          </p>
          {/* Feature pills */}
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {['⚡ Instant Payout', '🤖 AI-Powered', '📍 Parametric'].map(f => (
              <span key={f} className="px-3 py-1 rounded-full text-xs text-purple-200 border border-purple-500/40"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                {f}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6"
        >
          {step === 'phone' ? (
            <>
              <h2 className="text-[#2E1065] text-xl font-semibold mb-1">Sign In / Register</h2>
              <p className="text-gray-500 text-sm mb-6">Enter your mobile number to continue</p>

              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-2 font-medium">Mobile Number</label>
                <div className="flex items-center gap-2 border-2 rounded-2xl px-4 py-3 focus-within:border-[#2E1065] transition-colors" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center gap-1 text-gray-600 text-sm font-medium pr-2 border-r border-gray-200">
                    <span className="text-base">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <Phone size={16} className="text-gray-400 ml-1" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="flex-1 outline-none text-gray-800 placeholder-gray-300 bg-transparent"
                  />
                </div>
              </div>

              {/* Platform quick-connect */}
              <div className="mb-5">
                <p className="text-xs text-gray-500 mb-2 font-medium">Quick Connect via</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Zomato', color: '#E23744', emoji: '🍕' },
                    { name: 'Swiggy', color: '#FC8019', emoji: '🛵' },
                  ].map(p => (
                    <button key={p.name}
                      className="flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{ borderColor: `${p.color}30`, background: `${p.color}08`, color: p.color }}
                    >
                      <span>{p.emoji}</span> {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={phone.length < 10 || loading}
                className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                style={{ background: phone.length >= 10 ? 'linear-gradient(135deg, #2E1065, #7C3AED)' : '#CBD5E1' }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Get OTP <ArrowRight size={18} /></>
                )}
              </button>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <button
                onClick={() => navigate('/admin')}
                className="w-full mt-4 py-3 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 border-2 transition-all hover:border-[#2E1065]/30"
                style={{ borderColor: '#E2E8F0', color: '#2E1065' }}
              >
                <Lock size={14} /> Insurer Admin Portal
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStep('phone')} className="text-[#2E1065] text-sm mb-4 flex items-center gap-1">
                ← Back
              </button>
              <h2 className="text-[#2E1065] text-xl font-semibold mb-1">Verify OTP</h2>
              <p className="text-gray-500 text-sm mb-1">Sent to +91 {phone}</p>
              <p className="text-[#10B981] text-xs mb-6 font-medium">Use demo OTP: 123456</p>

              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-colors"
                    style={{ borderColor: digit ? '#2E1065' : '#E2E8F0', color: '#2E1065' }}
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                disabled={otp.join('').length < 6 || loading}
                className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Verify & Continue <ArrowRight size={18} /></>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                {resendTimer > 0 ? (
                  <span>Resend OTP in <span className="text-[#2E1065] font-medium">{resendTimer}s</span></span>
                ) : (
                  <button className="text-[#2E1065] font-medium" onClick={() => setResendTimer(30)}>Resend OTP</button>
                )}
              </p>
            </>
          )}
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="text-center pb-8 px-6">
        <p className="text-purple-300/60 text-xs">Protected by 256-bit encryption · Regulated by IRDAI</p>
      </div>
    </div>
  );
}