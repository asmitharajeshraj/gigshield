/**
 * GigShield — Full 6-Step Registration
 * Step 0: Personal Details   (name, DOB, gender, email)
 * Step 1: Identity Verify    (Aadhaar, PAN validation)
 * Step 2: Platform & Work    (platform, worker ID, hours, experience)
 * Step 3: Payment Setup      (UPI, bank account, IFSC)
 * Step 4: AI Risk Assessment (animated generation + result)
 * Step 5: Registration Done  (welcome + summary)
 */
import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Shield, User, Fingerprint, Truck, CreditCard, Cpu,
  CheckCircle, ChevronRight, Eye, EyeOff, AlertCircle,
  ArrowLeft, Zap, Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

// ── Helpers ────────────────────────────────────────────────────────────────────

const validateAadhaar = (v: string) => /^\d{12}$/.test(v);
const validatePAN     = (v: string) => /^[A-Z]{5}\d{4}[A-Z]$/.test(v.toUpperCase());
const validateUPI     = (v: string) => /^[\w.\-_]+@[\w]+$/.test(v);
const validateIFSC    = (v: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v.toUpperCase());
const validateEmail   = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const CITIES = ['Chennai','Mumbai','Delhi','Bangalore','Hyderabad','Kolkata','Pune','Ahmedabad','Surat','Jaipur','Lucknow','Bhopal'];

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <AlertCircle size={11} /> {msg}
    </p>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const labels = ['Personal', 'Identity', 'Platform', 'Payment', 'AI Risk', 'Done'];
  return (
    <div className="px-5 pt-5 pb-4" style={{ background: 'linear-gradient(135deg, #2E1065, #4C1D95)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
          <Shield size={14} className="text-white" />
        </div>
        <span className="text-white font-semibold text-sm">GigShield Registration</span>
        <span className="ml-auto text-white/60 text-xs">Step {step + 1}/{total}</span>
      </div>
      <div className="flex gap-1.5">
        {labels.map((l, i) => (
          <div key={l} className="flex-1">
            <div className="h-1 rounded-full mb-1 transition-all duration-500"
              style={{ background: i <= step ? '#A78BFA' : 'rgba(255,255,255,0.2)' }} />
            {i === step && <span className="text-purple-200 text-[9px] leading-none">{l}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step components ────────────────────────────────────────────────────────────

function Step0Personal({ data, onChange, onNext }: any) {
  const errors = {
    name:   !data.name || data.name.trim().length < 2,
    dob:    !data.dob,
    gender: !data.gender,
    email:  data.email && !validateEmail(data.email),
  };
  const valid = !errors.name && !errors.dob && !errors.gender && !errors.email;

  return (
    <motion.div key="s0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <User size={15} style={{ color: '#2E1065' }} />
          </div>
          <h3 className="font-semibold" style={{ color: '#2E1065' }}>Personal Details</h3>
        </div>
        <div className="space-y-3">
          {/* Name */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Full Name *</label>
            <input className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-colors text-gray-800 text-sm"
              style={{ borderColor: errors.name && data.name !== '' ? '#EF4444' : '#E2E8F0' }}
              placeholder="As on Aadhaar card"
              value={data.name} onChange={e => onChange('name', e.target.value)} />
            {errors.name && data.name !== '' && <FieldError msg="Please enter your full name (min 2 chars)" />}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Date of Birth *</label>
            <input type="date" className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-colors text-gray-800 text-sm"
              style={{ borderColor: '#E2E8F0' }}
              max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              value={data.dob} onChange={e => onChange('dob', e.target.value)} />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Gender *</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ v: 'male', l: '♂ Male' }, { v: 'female', l: '♀ Female' }, { v: 'other', l: '⚧ Other' }].map(g => (
                <button key={g.v} onClick={() => onChange('gender', g.v)}
                  className="py-2.5 rounded-xl text-xs font-medium border-2 transition-all"
                  style={{
                    borderColor: data.gender === g.v ? '#7C3AED' : '#E2E8F0',
                    background: data.gender === g.v ? '#EDE9FE' : 'white',
                    color: data.gender === g.v ? '#7C3AED' : '#64748B',
                  }}>
                  {g.l}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Email Address (optional)</label>
            <input type="email" className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-colors text-gray-800 text-sm"
              style={{ borderColor: errors.email ? '#EF4444' : '#E2E8F0' }}
              placeholder="for policy documents"
              value={data.email} onChange={e => onChange('email', e.target.value)} />
            {errors.email && <FieldError msg="Please enter a valid email address" />}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">City *</label>
            <select className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 text-gray-800 bg-white text-sm"
              style={{ borderColor: '#E2E8F0' }}
              value={data.city} onChange={e => onChange('city', e.target.value)}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Pincode *</label>
            <input className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-colors text-gray-800 text-sm"
              style={{ borderColor: '#E2E8F0' }} placeholder="6-digit pincode" maxLength={6}
              value={data.pincode} onChange={e => onChange('pincode', e.target.value.replace(/\D/g, ''))} />
          </div>
        </div>
      </div>
      <button onClick={onNext} disabled={!valid}
        className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
        Next: Identity Verification <ChevronRight size={18} />
      </button>
    </motion.div>
  );
}

function Step1Identity({ data, onChange, onNext, onBack }: any) {
  const [showAadhaar, setShowAadhaar] = useState(false);
  const aadhaarOk = validateAadhaar(data.aadhaar);
  const panOk     = validatePAN(data.pan);
  const valid = aadhaarOk && panOk;

  return (
    <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Fingerprint size={15} style={{ color: '#2E1065' }} />
          </div>
          <h3 className="font-semibold" style={{ color: '#2E1065' }}>Identity Verification</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">Only the last 4 digits of Aadhaar are stored. KYC via UIDAI API.</p>

        {/* Aadhaar */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1 font-medium">Aadhaar Number * (12 digits)</label>
          <div className="relative">
            <input
              type={showAadhaar ? 'text' : 'password'}
              className="w-full border-2 rounded-xl px-4 py-3 pr-10 outline-none focus:border-purple-600 transition-colors text-gray-800 text-sm tracking-widest"
              style={{ borderColor: data.aadhaar && !aadhaarOk ? '#EF4444' : aadhaarOk ? '#10B981' : '#E2E8F0' }}
              placeholder="XXXX XXXX XXXX" maxLength={12}
              value={data.aadhaar} onChange={e => onChange('aadhaar', e.target.value.replace(/\D/g, ''))} />
            <button className="absolute right-3 top-3.5 text-gray-400" onClick={() => setShowAadhaar(s => !s)}>
              {showAadhaar ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {data.aadhaar && !aadhaarOk && <FieldError msg="Aadhaar must be exactly 12 digits" />}
          {aadhaarOk && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle size={11} /> Aadhaar format valid — will be verified via UIDAI OTP
            </p>
          )}
        </div>

        {/* PAN */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1 font-medium">PAN Card Number * (e.g. ABCDE1234F)</label>
          <input
            className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-colors text-gray-800 text-sm uppercase tracking-widest"
            style={{ borderColor: data.pan && !panOk ? '#EF4444' : panOk ? '#10B981' : '#E2E8F0' }}
            placeholder="ABCDE1234F" maxLength={10}
            value={data.pan} onChange={e => onChange('pan', e.target.value.toUpperCase())} />
          {data.pan && !panOk && <FieldError msg="Invalid PAN format — must be AAAAA9999A" />}
          {panOk && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={11} /> Valid PAN format</p>}
        </div>

        {/* Driving License (optional) */}
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Driving License No. (optional, for vehicle-related claims)</label>
          <input className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-colors text-gray-800 text-sm"
            style={{ borderColor: '#E2E8F0' }} placeholder="TN22 20230012345"
            value={data.license} onChange={e => onChange('license', e.target.value.toUpperCase())} />
        </div>

        <div className="mt-4 p-3 rounded-xl flex gap-2" style={{ background: '#EFF6FF' }}>
          <span className="text-blue-500 mt-0.5">🔒</span>
          <p className="text-blue-600 text-xs">Your identity documents are end-to-end encrypted and never shared with Zomato or Swiggy. Used only for IRDAI compliance and fraud prevention.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl font-semibold border-2 flex items-center justify-center gap-1 text-sm" style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={onNext} disabled={!valid}
          className="flex-[2] py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
          Verify & Continue <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

function Step2Platform({ data, onChange, onNext, onBack }: any) {
  return (
    <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Truck size={15} style={{ color: '#2E1065' }} />
          </div>
          <h3 className="font-semibold" style={{ color: '#2E1065' }}>Platform & Work Details</h3>
        </div>

        {/* Platform select */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-2 font-medium">Delivery Platform *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'zomato', label: 'Zomato', emoji: '🍕', color: '#E23744', placeholder: 'ZOM-CH-XXXX' },
              { id: 'swiggy', label: 'Swiggy', emoji: '🛵', color: '#FC8019', placeholder: 'SWG-CH-XXXX' },
            ].map(p => (
              <button key={p.id} onClick={() => onChange('platform', p.id)}
                className="flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all"
                style={{ borderColor: data.platform === p.id ? p.color : '#E2E8F0', background: data.platform === p.id ? `${p.color}10` : 'white' }}>
                <span className="text-3xl">{p.emoji}</span>
                <span className="text-sm font-semibold" style={{ color: data.platform === p.id ? p.color : '#64748B' }}>{p.label}</span>
                {data.platform === p.id && <CheckCircle size={14} style={{ color: p.color }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Worker ID */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1 font-medium">Worker / Rider ID *</label>
          <input className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-colors text-gray-800 text-sm"
            style={{ borderColor: '#E2E8F0' }}
            placeholder={data.platform === 'zomato' ? 'ZOM-CH-9284' : 'SWG-CH-7391'}
            value={data.workerId} onChange={e => onChange('workerId', e.target.value)} />
        </div>

        {/* Work hours */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-500 font-medium">Avg. Work Hours per Day *</label>
            <span className="text-sm font-bold" style={{ color: '#2E1065' }}>{data.hoursPerDay}h</span>
          </div>
          <input type="range" min={2} max={16} step={1} value={data.hoursPerDay}
            onChange={e => onChange('hoursPerDay', +e.target.value)}
            className="w-full accent-purple-700" />
          <div className="flex justify-between text-xs text-gray-300 mt-0.5"><span>2h</span><span>16h</span></div>
        </div>

        {/* Experience */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-500 font-medium">Delivery Experience</label>
            <span className="text-sm font-bold" style={{ color: '#2E1065' }}>
              {data.experienceYears === 0 ? '<1 yr' : `${data.experienceYears} yr${data.experienceYears > 1 ? 's' : ''}`}
            </span>
          </div>
          <input type="range" min={0} max={10} step={1} value={data.experienceYears}
            onChange={e => onChange('experienceYears', +e.target.value)}
            className="w-full accent-purple-700" />
          <div className="flex justify-between text-xs text-gray-300 mt-0.5"><span>New</span><span>10+ yrs</span></div>
        </div>

        {/* Accident history */}
        <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
          <div>
            <p className="text-sm font-medium text-gray-700">Prior accident in last 2 years?</p>
            <p className="text-xs text-gray-400">Affects premium loading</p>
          </div>
          <button onClick={() => onChange('hasAccidentHistory', !data.hasAccidentHistory)}
            className="w-12 h-6 rounded-full transition-all relative"
            style={{ background: data.hasAccidentHistory ? '#EF4444' : '#E2E8F0' }}>
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all"
              style={{ left: data.hasAccidentHistory ? '26px' : '2px' }} />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl border-2 font-semibold flex items-center justify-center gap-1 text-sm" style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={onNext} disabled={!data.workerId}
          className="flex-[2] py-4 rounded-2xl text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
          Next: Payment Setup <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

function Step3Payment({ data, onChange, onNext, onBack, phone }: any) {
  const upiOk  = validateUPI(data.upiId);
  const ifscOk = data.ifsc ? validateIFSC(data.ifsc) : true;
  const valid  = upiOk && ifscOk;

  return (
    <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <CreditCard size={15} style={{ color: '#2E1065' }} />
          </div>
          <h3 className="font-semibold" style={{ color: '#2E1065' }}>Payout & Payment Setup</h3>
        </div>

        {/* UPI */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1 font-medium">UPI ID * (for instant payouts)</label>
          <input className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-colors text-gray-800 text-sm"
            style={{ borderColor: data.upiId && !upiOk ? '#EF4444' : upiOk ? '#10B981' : '#E2E8F0' }}
            placeholder={`${phone}@upi`}
            value={data.upiId} onChange={e => onChange('upiId', e.target.value)} />
          {data.upiId && !upiOk && <FieldError msg="Enter a valid UPI ID (e.g. 9876543210@upi)" />}
          {upiOk && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={11} /> UPI ID will be verified</p>}
        </div>

        {/* Quick-fill UPI */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[`${phone}@upi`, `${phone}@okaxis`, `${phone}@paytm`].map(u => (
            <button key={u} onClick={() => onChange('upiId', u)}
              className="py-1.5 rounded-lg text-xs border truncate transition-all"
              style={{ borderColor: data.upiId === u ? '#7C3AED' : '#E2E8F0', color: '#2E1065', background: data.upiId === u ? '#EDE9FE' : 'white' }}>
              {u}
            </button>
          ))}
        </div>

        {/* Bank */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1 font-medium">Bank Account Number (optional)</label>
          <input className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-colors text-gray-800 text-sm"
            style={{ borderColor: '#E2E8F0' }} placeholder="for NEFT fallback"
            value={data.bankAccount} onChange={e => onChange('bankAccount', e.target.value.replace(/\D/g, ''))} />
        </div>

        {/* IFSC */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1 font-medium">IFSC Code (optional)</label>
          <input className="w-full border-2 rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-colors text-gray-800 text-sm uppercase"
            style={{ borderColor: data.ifsc && !ifscOk ? '#EF4444' : '#E2E8F0' }}
            placeholder="SBIN0001234" maxLength={11}
            value={data.ifsc} onChange={e => onChange('ifsc', e.target.value.toUpperCase())} />
          {data.ifsc && !ifscOk && <FieldError msg="IFSC must be 11 chars (e.g. SBIN0001234)" />}
        </div>

        {/* AutoPay consent */}
        <div className="p-3 rounded-xl" style={{ background: '#F0FDF4' }}>
          <p className="text-green-700 text-xs font-semibold mb-1">✓ UPI AutoPay Authorization</p>
          <p className="text-green-600 text-xs">By proceeding, you authorize GigShield to debit your weekly premium via NPCI UPI AutoPay mandate. Cancel anytime from the app.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl border-2 font-semibold flex items-center justify-center gap-1 text-sm" style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={onNext} disabled={!valid}
          className="flex-[2] py-4 rounded-2xl text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
          Next: AI Risk Scan <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

const riskTasks = [
  { label: 'Fetching IMD weather history for your pincode...', icon: '🌧️' },
  { label: 'Analysing CPCB AQI trends (last 90 days)...', icon: '💨' },
  { label: 'Scanning platform uptime records...', icon: '📱' },
  { label: 'Processing rider experience & work hours...', icon: '🛵' },
  { label: 'Running ML fraud-risk model...', icon: '🤖' },
  { label: 'Generating personalised premium matrix...', icon: '💎' },
];

const riskFactors = [
  { label: 'Rain Exposure', score: 78, color: '#3B82F6' },
  { label: 'AQI Zone Risk', score: 55, color: '#8B5CF6' },
  { label: 'Peak Hour Risk', score: 62, color: '#F59E0B' },
  { label: 'Platform Stability', score: 45, color: '#10B981' },
];

function Step4Risk({ onNext, onBack }: any) {
  const [taskIdx, setTaskIdx] = useState(-1);
  const [done, setDone] = useState(false);

  const start = useCallback(() => {
    setTaskIdx(0);
    let i = 0;
    const run = () => {
      i++;
      if (i < riskTasks.length) {
        setTimeout(() => { setTaskIdx(i); run(); }, 650);
      } else {
        setTimeout(() => setDone(true), 800);
      }
    };
    setTimeout(run, 650);
  }, []);

  return (
    <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Cpu size={15} style={{ color: '#2E1065' }} />
          </div>
          <h3 className="font-semibold" style={{ color: '#2E1065' }}>AI Risk Assessment</h3>
        </div>

        {taskIdx === -1 && !done && (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">🤖</div>
            <p className="text-gray-600 text-sm mb-2">Our AI analyses 40+ real-world risk signals</p>
            <p className="text-gray-400 text-xs mb-6">Weather data · Platform uptime · City AQI · Your work pattern</p>
            <button onClick={start} className="px-8 py-3 rounded-2xl text-white font-semibold"
              style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
              🔮 Run AI Risk Scan
            </button>
          </div>
        )}

        {taskIdx >= 0 && !done && (
          <div className="py-4 space-y-2.5">
            {riskTasks.slice(0, taskIdx + 1).map((t, i) => (
              <motion.div key={t.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2.5">
                <span className="text-base">{t.icon}</span>
                <span className="text-xs text-gray-600 flex-1">{t.label}</span>
                {i < taskIdx
                  ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  : <div className="w-3.5 h-3.5 border-2 border-purple-300 border-t-purple-700 rounded-full animate-spin flex-shrink-0" />
                }
              </motion.div>
            ))}
          </div>
        )}

        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Score */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-gray-500">Overall Risk Score</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black" style={{ color: '#F59E0B' }}>64</span>
                  <span className="text-gray-400 text-sm mb-1">/100</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#FEF3C7', color: '#B45309' }}>
                  Moderate Risk
                </span>
              </div>
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                <motion.circle cx="18" cy="18" r="15.9" fill="none" stroke="#EAB308" strokeWidth="3"
                  strokeDasharray={`0 100`} animate={{ strokeDasharray: `64 36` }}
                  transition={{ duration: 1 }} strokeLinecap="round" />
              </svg>
            </div>

            {/* Bars */}
            <div className="space-y-2.5 mb-4">
              {riskFactors.map(f => (
                <div key={f.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">{f.label}</span>
                    <span className="font-medium" style={{ color: f.color }}>{f.score}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${f.score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full" style={{ background: f.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl" style={{ background: '#FEF3C7' }}>
              <p className="text-amber-800 text-xs font-semibold">⚠️ Monsoon season elevated risk</p>
              <p className="text-amber-600 text-xs mt-0.5">IMD forecasts &gt;65mm rain for your zone next 4 weeks.
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl border-2 font-semibold flex items-center justify-center gap-1 text-sm" style={{ borderColor: '#E2E8F0', color: '#2E1065' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={onNext} disabled={!done}
          className="flex-[2] py-4 rounded-2xl text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
          Choose Your Plan <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

function Step5Complete({ data, onFinish }: any) {
  return (
    <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="text-center mb-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-5xl">🎉</span>
        </motion.div>
        <h2 className="font-black text-2xl" style={{ color: '#2E1065' }}>Registration Complete!</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome to GigShield, {data.name || 'Rider'}!</p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 space-y-2">
        <p className="font-semibold text-sm mb-3" style={{ color: '#2E1065' }}>Your Profile Summary</p>
        {[
          { k: 'Name', v: data.name || '—' },
          { k: 'Platform', v: data.platform === 'zomato' ? '🍕 Zomato' : '🛵 Swiggy' },
          { k: 'Aadhaar', v: `XXXX XXXX ${data.aadhaar?.slice(-4) || 'XXXX'}` },
          { k: 'UPI', v: data.upiId || '—' },
          { k: 'City', v: data.city },
          { k: 'Risk Score', v: '64/100 (Moderate)' },
          { k: 'Referral Code', v: `GS-${Math.random().toString(36).slice(2, 8).toUpperCase()}` },
        ].map(row => (
          <div key={row.k} className="flex justify-between text-sm border-b border-gray-50 pb-2">
            <span className="text-gray-400">{row.k}</span>
            <span className="font-medium text-gray-700">{row.v}</span>
          </div>
        ))}
      </div>

      <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Star size={14} style={{ color: '#7C3AED' }} />
          <span className="text-sm font-semibold" style={{ color: '#2E1065' }}>Welcome Bonus</span>
        </div>
        <p className="text-purple-600 text-xs">🎁 50 GigShield Points added · Share your referral code and earn ₹29 per signup</p>
      </div>

      <button onClick={onFinish}
        className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #2E1065, #7C3AED)' }}>
        <Zap size={18} /> Choose Insurance Plan
      </button>
    </motion.div>
  );
}

// ── Main Registration Component ────────────────────────────────────────────────

export function Registration() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setAuthenticated, setPremiumFactors } = useApp();
  const phone = (location.state as any)?.phone || '9876543210';

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 0
    name: '', dob: '', gender: '', email: '',
    city: 'Chennai', pincode: '600001',
    // Step 1
    aadhaar: '', pan: '', license: '',
    // Step 2
    platform: 'zomato' as 'zomato' | 'swiggy',
    workerId: '', hoursPerDay: 8, experienceYears: 2,
    hasAccidentHistory: false,
    // Step 3
    upiId: '', bankAccount: '', ifsc: '',
  });

  const onChange = (key: string, val: any) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleFinish = () => {
    setUser({
      phone,
      name: formData.name || 'Rajesh Kumar',
      dob: formData.dob,
      gender: formData.gender as any || 'male',
      email: formData.email,
      platform: formData.platform,
      workerId: formData.workerId || `${formData.platform === 'zomato' ? 'ZOM' : 'SWG'}-CH-9284`,
      aadhaarLast4: formData.aadhaar.slice(-4) || '1234',
      panNumber: formData.pan,
      riskScore: 64,
      city: formData.city,
      pincode: formData.pincode,
      upiId: formData.upiId || `${phone}@upi`,
      bankAccount: formData.bankAccount,
      ifsc: formData.ifsc,
      totalEarnings: 182400,
      deliveries: 1847,
      memberSince: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      experienceYears: formData.experienceYears,
      hoursPerDay: formData.hoursPerDay,
      loyaltyPoints: 50,
      referralCode: `GS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      weeksSinceLastClaim: 0,
    });
    setPremiumFactors({
      city: formData.city,
      platform: formData.platform,
      hoursPerDay: formData.hoursPerDay,
      experienceYears: formData.experienceYears,
      hasAccidentHistory: formData.hasAccidentHistory,
    });
    setAuthenticated(true);
    navigate('/premium');
  };

  const steps = [
    <Step0Personal key={0} data={formData} onChange={onChange} onNext={() => setStep(1)} />,
    <Step1Identity key={1} data={formData} onChange={onChange} onNext={() => setStep(2)} onBack={() => setStep(0)} />,
    <Step2Platform key={2} data={formData} onChange={onChange} onNext={() => setStep(3)} onBack={() => setStep(1)} />,
    <Step3Payment  key={3} data={formData} onChange={onChange} phone={phone} onNext={() => setStep(4)} onBack={() => setStep(2)} />,
    <Step4Risk     key={4} onNext={() => setStep(5)} onBack={() => setStep(3)} />,
    <Step5Complete key={5} data={formData} onFinish={handleFinish} />,
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <ProgressBar step={step} total={6} />
      <div className="px-5 py-5">
        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>
      </div>
    </div>
  );
}
