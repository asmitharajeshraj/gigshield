import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Shield, TrendingUp, TrendingDown, Users, AlertTriangle, Zap, Map, Settings, LogOut, Bell, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'motion/react';

const lossRatioData = [
  { month: 'Jan', actual: 58, target: 68, claims: 142 },
  { month: 'Feb', actual: 71, target: 68, claims: 198 },
  { month: 'Mar', actual: 64, target: 68, claims: 175 },
  { month: 'Apr', actual: 83, target: 68, claims: 240 },
  { month: 'May', actual: 72, target: 68, claims: 210 },
  { month: 'Jun', actual: 69, target: 68, claims: 195 },
  { month: 'Jul', actual: 91, target: 68, claims: 287 },
  { month: 'Aug', actual: 85, target: 68, claims: 263 },
  { month: 'Sep', actual: 73, target: 68, claims: 218 },
  { month: 'Oct', actual: 62, target: 68, claims: 158 },
  { month: 'Nov', actual: 67, target: 68, claims: 184 },
  { month: 'Dec', actual: 74, target: 68, claims: 212 },
];

const premiumData = [
  { week: 'W1', bronze: 29, silver: 59, gold: 99 },
  { week: 'W2', bronze: 29, silver: 59, gold: 107 },
  { week: 'W3', bronze: 35, silver: 65, gold: 115 },
  { week: 'W4', bronze: 29, silver: 59, gold: 99 },
];

const riskZones = [
  { zone: 'Chennai South', risk: 89, workers: 1240, surge: '+16%', color: '#EF4444' },
  { zone: 'Mumbai Suburbs', risk: 72, workers: 2180, surge: '+8%', color: '#F59E0B' },
  { zone: 'Bangalore East', risk: 45, workers: 1870, surge: '+0%', color: '#10B981' },
  { zone: 'Delhi NCR', risk: 61, workers: 3240, surge: '+4%', color: '#F59E0B' },
  { zone: 'Hyderabad West', risk: 38, workers: 980, surge: '-2%', color: '#10B981' },
  { zone: 'Kolkata Central', risk: 55, workers: 1120, surge: '+2%', color: '#3B82F6' },
];

const tierDistPie = [
  { name: 'Gold', value: 38, color: '#EAB308' },
  { name: 'Silver', value: 34, color: '#64748B' },
  { name: 'Bronze', value: 28, color: '#B45309' },
];

const navItems = [
  { icon: Activity, label: 'Dashboard', path: '/admin', active: true },
  { icon: Map, label: 'Risk Heatmap', path: '/admin', active: false },
  { icon: AlertTriangle, label: 'Fraud Detection', path: '/admin/fraud', active: false },
  { icon: TrendingUp, label: 'Analytics', path: '/admin', active: false },
  { icon: Users, label: 'Workers', path: '/admin', active: false },
  { icon: Settings, label: 'Settings', path: '/admin', active: false },
];

const kpis = [
  { label: 'Active Policies', val: '47,284', change: '+12.4%', up: true, color: '#2E1065', icon: Shield },
  { label: 'Weekly Premium', val: '₹38.2L', change: '+8.7%', up: true, color: '#10B981', icon: TrendingUp },
  { label: 'Claims Paid (MTD)', val: '₹12.8L', change: '+24.3%', up: false, color: '#EF4444', icon: Zap },
  { label: 'Loss Ratio', val: '74%', change: 'Target: 68%', up: false, color: '#F59E0B', icon: AlertTriangle },
  { label: 'Fraud Caught', val: '23', change: '₹4.2L saved', up: true, color: '#7C3AED', icon: Shield },
  { label: 'Avg Payout Time', val: '4.1s', change: '-18% vs last wk', up: true, color: '#3B82F6', icon: Activity },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} transition-all duration-300 flex flex-col border-r`}
        style={{ background: '#2E1065', borderColor: '#3D1A7A' }}>
        {/* Logo */}
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: '#3D1A7A' }}>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-bold text-sm">GigShield</p>
              <p className="text-purple-300 text-xs">Admin Console</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => { setActiveNav(item.label); navigate(item.path); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${activeNav === item.label ? 'bg-white/15' : 'hover:bg-white/8'}`}
            >
              <item.icon size={16} className="flex-shrink-0" style={{ color: activeNav === item.label ? 'white' : 'rgba(255,255,255,0.5)' }} />
              {sidebarOpen && <span className="text-sm" style={{ color: activeNav === item.label ? 'white' : 'rgba(255,255,255,0.6)' }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t" style={{ borderColor: '#3D1A7A' }}>
          <button onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8">
            <LogOut size={16} className="flex-shrink-0 text-purple-300" />
            {sidebarOpen && <span className="text-sm text-purple-300">Exit Admin</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100">
              <div className="space-y-1">
                {[...Array(3)].map((_, i) => <div key={i} className="w-4 h-0.5 bg-gray-600" />)}
              </div>
            </button>
            <div>
              <h1 className="font-bold text-gray-800">Risk & Pricing Engine</h1>
              <p className="text-xs text-gray-400">Real-time insurance analytics · Updated 2 min ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#DCFCE7', color: '#166534' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              All Systems Operational
            </div>
            <button onClick={() => navigate('/admin/fraud')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ background: '#EF4444' }}>
              <AlertTriangle size={12} /> 23 Fraud Alerts
            </button>
            <div className="relative">
              <Bell size={18} className="text-gray-500 cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold" style={{ fontSize: '9px' }}>5</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold" style={{ color: '#2E1065' }}>
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {kpis.map((kpi, i) => (
              <motion.div key={kpi.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">{kpi.label}</span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}15` }}>
                    <kpi.icon size={13} style={{ color: kpi.color }} />
                  </div>
                </div>
                <p className="text-xl font-bold" style={{ color: '#1E293B' }}>{kpi.val}</p>
                <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {kpi.change}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Loss Ratio Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-800">Loss Ratio vs Target</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Target range: 65–72% · Current: 74% ⚠</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#2E1065' }} /><span className="text-gray-500">Actual</span></div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-orange-400" /><span className="text-gray-500">Target 68%</span></div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={lossRatioData}>
                  <defs>
                    <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E1065" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2E1065" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[50, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    formatter={(v: any, name: any) => [`${v}%`, name === 'actual' ? 'Loss Ratio' : 'Target']} />
                  <Area type="monotone" dataKey="actual" stroke="#2E1065" strokeWidth={2.5} fill="url(#lossGrad)"
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      return <circle key={`dot-${payload.month}`} cx={cx} cy={cy} r={4} fill={payload.actual > 68 ? '#EF4444' : '#10B981'} />;
                    }} />
                  <Line type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Tier Distribution */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-1">Tier Distribution</h2>
              <p className="text-xs text-gray-400 mb-4">47,284 active policies</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={tierDistPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    dataKey="value" paddingAngle={3}>
                    {tierDistPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {tierDistPie.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-xs text-gray-600">{d.name === 'Gold' ? '🥇' : d.name === 'Silver' ? '🥈' : '🥉'} {d.name}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: d.color }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Premium Surge Heatmap */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-1">High-Risk Zones — Next Week</h2>
              <p className="text-xs text-gray-400 mb-4">Premium surges based on IMD + AQI forecasts</p>
              <div className="space-y-3">
                {riskZones.map(zone => (
                  <div key={zone.zone}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: zone.color }} />
                        <span className="text-xs font-medium text-gray-700">{zone.zone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-400">{zone.workers.toLocaleString()} workers</span>
                        <span className="font-semibold" style={{ color: zone.color }}>{zone.surge}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${zone.risk}%` }} transition={{ delay: 0.3, duration: 0.8 }}
                        className="h-full rounded-full" style={{ background: zone.color }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{zone.risk}% risk score</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Pricing Chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-1">Dynamic Premium Trends</h2>
              <p className="text-xs text-gray-400 mb-4">AI-adjusted weekly premiums (₹)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={premiumData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    formatter={(v: any, name: string) => [`₹${v}`, name.charAt(0).toUpperCase() + name.slice(1)]} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="bronze" fill="#B45309" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="silver" fill="#64748B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gold" fill="#EAB308" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Alerts */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Active Risk Alerts</h2>
              <button onClick={() => navigate('/admin/fraud')}
                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{ background: '#EDE9FE', color: '#5B21B6' }}>
                View All Alerts <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { zone: 'Chennai South', type: '🌧️ Heavy Rain', risk: 'Critical', workers: 1240, surge: '+16%', bg: '#FEE2E2', color: '#991B1B' },
                { zone: 'Mumbai Suburbs', type: '🌡️ Heatwave Warning', risk: 'High', workers: 2180, surge: '+8%', bg: '#FEF3C7', color: '#92400E' },
                { zone: 'Delhi NCR', type: '💨 AQI 280 Severe', risk: 'Moderate', workers: 3240, surge: '+4%', bg: '#DBEAFE', color: '#1E40AF' },
              ].map(alert => (
                <div key={alert.zone} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: alert.bg }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm" style={{ color: alert.color }}>{alert.zone}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-white" style={{ color: alert.color }}>{alert.risk}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: alert.color }}>{alert.type} · {alert.workers.toLocaleString()} workers affected</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: alert.color }}>{alert.surge} premium</p>
                    <p className="text-xs" style={{ color: alert.color }}>surge applied</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payouts */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Recent Automated Payouts</h2>
              <span className="text-xs text-gray-400">Avg: 4.1s processing</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    {['Worker', 'Zone', 'Trigger', 'Amount', 'Time', 'Status'].map(h => (
                      <th key={h} className="pb-3 text-xs font-semibold text-gray-400 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { worker: 'Rajesh K.', zone: 'Chennai 600001', trigger: '🌧️ Rain 52mm', amount: '₹420', time: '4.1s', status: 'paid' },
                    { worker: 'Priya M.', zone: 'Mumbai 400001', trigger: '🌡️ Heat 43°C', amount: '₹840', time: '3.8s', status: 'paid' },
                    { worker: 'Arun S.', zone: 'Delhi 110001', trigger: '💨 AQI 320', amount: '₹420', time: '5.2s', status: 'paid' },
                    { worker: 'Suresh P.', zone: 'Chennai 600011', trigger: '📱 App Crash 3h', amount: '₹350', time: '6.1s', status: 'processing' },
                    { worker: 'Lakshmi R.', zone: 'Bangalore 560001', trigger: '🚫 Curfew 144', amount: '₹1,200', time: '—', status: 'review' },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-4 font-medium text-gray-800">{row.worker}</td>
                      <td className="py-3 pr-4 text-gray-500 text-xs">{row.zone}</td>
                      <td className="py-3 pr-4 text-gray-600 text-xs">{row.trigger}</td>
                      <td className="py-3 pr-4 font-bold text-gray-800">{row.amount}</td>
                      <td className="py-3 pr-4 text-gray-400 text-xs">{row.time}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: row.status === 'paid' ? '#DCFCE7' : row.status === 'processing' ? '#FEF3C7' : '#FEE2E2',
                            color: row.status === 'paid' ? '#166534' : row.status === 'processing' ? '#92400E' : '#991B1B',
                          }}>
                          {row.status === 'paid' ? '✓ Paid' : row.status === 'processing' ? '⏳ Processing' : '🔍 Review'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
