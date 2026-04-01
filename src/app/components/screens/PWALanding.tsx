import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Smartphone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function PWAInstallPrompt({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[340px] bg-white rounded-2xl shadow-2xl border p-4 z-50"
      style={{ borderColor: '#E2E8F0' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#2E1065' }}>
          <Smartphone size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm" style={{ color: '#2E1065' }}>Add GigShield to Home Screen</p>
          <p className="text-xs text-gray-500 mt-0.5">Get instant alerts & access your shield offline</p>
        </div>
        <button onClick={onDismiss} className="text-gray-300 hover:text-gray-400">
          <X size={16} />
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={onDismiss} className="flex-1 py-2 rounded-xl text-xs text-gray-400 border" style={{ borderColor: '#E2E8F0' }}>
          Not Now
        </button>
        <button className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: '#2E1065' }}>
          Install App
        </button>
      </div>
    </motion.div>
  );
}
