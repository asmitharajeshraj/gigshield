import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Bell, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

const notifs = [
  { id: 1, icon: '🌧️', title: 'Heavy Rain Alert', body: 'Chennai South: 52mm rain detected. Your coverage is active.', time: '2 min ago', type: 'alert', read: false },
  { id: 2, icon: '💸', title: 'Payout Credited', body: '₹420 has been transferred to 9876543210@upi', time: '15 min ago', type: 'payout', read: false },
  { id: 3, icon: '🔄', title: 'Policy Auto-Renewed', body: 'Gold Shield renewed for week of Mar 20–26, 2026', time: '2 hours ago', type: 'policy', read: false },
  { id: 4, icon: '💨', title: 'AQI Monitor Update', body: 'Air quality in your zone: 150 (Unhealthy). Near your threshold.', time: '5 hours ago', type: 'alert', read: true },
  { id: 5, icon: '⭐', title: 'Loyalty Milestone!', body: 'You\'ve been with GigShield for 3 months. Enjoy ₹6 off next week!', time: '1 day ago', type: 'promo', read: true },
  { id: 6, icon: '📊', title: 'Weekly Risk Report', body: 'Next week forecast: Moderate risk. Monsoon patterns detected.', time: '2 days ago', type: 'info', read: true },
  { id: 7, icon: '🎉', title: 'Referral Bonus', body: 'Ravi Kumar joined using your code! ₹50 added to your wallet.', time: '3 days ago', type: 'promo', read: true },
];

const typeColors: Record<string, { bg: string; color: string }> = {
  alert: { bg: '#FEE2E2', color: '#991B1B' },
  payout: { bg: '#DCFCE7', color: '#166534' },
  policy: { bg: '#EDE9FE', color: '#5B21B6' },
  promo: { bg: '#FEF3C7', color: '#92400E' },
  info: { bg: '#DBEAFE', color: '#1E40AF' },
};

export function Notifications() {
  const navigate = useNavigate();
  const { language } = useApp();
  const [readIds, setReadIds] = useState<number[]>([4, 5, 6, 7]);
  const [filter, setFilter] = useState('All');

  const markAllRead = () => setReadIds(notifs.map(n => n.id));
  const unreadCount = notifs.filter(n => !readIds.includes(n.id)).length;

  const filterTabs = ['All', 'Alerts', 'Payouts', 'Policy'];
  const filtered = notifs.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Alerts') return n.type === 'alert';
    if (filter === 'Payouts') return n.type === 'payout';
    if (filter === 'Policy') return n.type === 'policy' || n.type === 'info';
    return true;
  });

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: 'linear-gradient(135deg, #2E1065, #4C1D95)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-white" />
            <span className="text-white font-semibold">GigShield</span>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-purple-200 hover:text-white">
              <Check size={12} /> Mark all read
            </button>
          )}
        </div>
        <h1 className="text-white font-bold text-xl">Notifications</h1>
        <p className="text-purple-200 text-sm mt-0.5">
          {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
        </p>
      </div>

      <div className="px-5 py-4">
        {/* Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {filterTabs.map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              className="px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
              style={{
                background: filter === tab ? '#2E1065' : 'white',
                color: filter === tab ? 'white' : '#64748B',
                border: `1px solid ${filter === tab ? '#2E1065' : '#E2E8F0'}`,
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          {filtered.map((notif, idx) => {
            const isRead = readIds.includes(notif.id);
            const tc = typeColors[notif.type] || typeColors.info;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => setReadIds(prev => [...new Set([...prev, notif.id])])}
                className="bg-white rounded-2xl p-4 border shadow-sm cursor-pointer transition-all active:scale-[0.99]"
                style={{ borderColor: !isRead ? '#A78BFA40' : '#E2E8F0', borderLeftWidth: !isRead ? '3px' : '1px', borderLeftColor: !isRead ? '#7C3AED' : '#E2E8F0' }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: tc.bg }}>
                    {notif.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm text-gray-800">{notif.title}</p>
                      {!isRead && <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.body}</p>
                    <p className="text-xs text-gray-300 mt-1.5">{notif.time}</p>
                  </div>
                </div>

                {notif.type === 'alert' && !isRead && (
                  <button
                    onClick={e => { e.stopPropagation(); navigate('/app/alert'); }}
                    className="w-full mt-3 py-2 rounded-xl text-xs font-medium"
                    style={{ background: '#FEE2E2', color: '#991B1B' }}>
                    View Alert Details →
                  </button>
                )}
                {notif.type === 'payout' && !isRead && (
                  <button
                    onClick={e => { e.stopPropagation(); navigate('/app/payout'); }}
                    className="w-full mt-3 py-2 rounded-xl text-xs font-medium"
                    style={{ background: '#DCFCE7', color: '#166534' }}>
                    View Receipt →
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mt-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={14} style={{ color: '#2E1065' }} />
            <p className="font-semibold text-sm" style={{ color: '#2E1065' }}>Notification Preferences</p>
          </div>
          {[
            { label: 'Rain/Weather Alerts', enabled: true },
            { label: 'Payout Confirmations', enabled: true },
            { label: 'Policy Renewals', enabled: true },
            { label: 'Promotional Offers', enabled: false },
          ].map(pref => (
            <div key={pref.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">{pref.label}</span>
              <div className={`w-10 h-5 rounded-full transition-colors ${pref.enabled ? 'bg-purple-600' : 'bg-gray-200'}`}
                style={{ background: pref.enabled ? '#2E1065' : '#E2E8F0' }}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm m-0.5 transition-transform ${pref.enabled ? 'translate-x-5' : ''}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}