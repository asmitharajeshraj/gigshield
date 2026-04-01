import { createBrowserRouter } from 'react-router';
import { SignIn }              from './components/screens/SignIn';
import { Registration }       from './components/screens/Registration';
import { KYCSetup }           from './components/screens/KYCSetup';
import { PremiumSelect }      from './components/screens/PremiumSelect';
import { Dashboard }          from './components/screens/Dashboard';
import { AlertScreen }        from './components/screens/AlertScreen';
import { PayoutScreen }       from './components/screens/PayoutScreen';
import { ClaimsManagement }   from './components/screens/ClaimsManagement';
import { PolicyManagement }   from './components/screens/PolicyManagement';
import { PremiumCalculator }  from './components/screens/PremiumCalculator';
import { Profile }            from './components/screens/Profile';
import { Notifications }      from './components/screens/Notifications';
import { MobileLayout }       from './components/layout/MobileLayout';
import { AdminDashboard }     from './components/admin/AdminDashboard';
import { FraudDetection }     from './components/admin/FraudDetection';

export const router = createBrowserRouter([
  // ── Auth & Onboarding ─────────────────────────────────────────────────────
  { path: '/',        Component: SignIn },
  { path: '/register',Component: Registration },   // Full 6-step registration
  { path: '/kyc',     Component: KYCSetup },        // Legacy 3-step (still accessible)
  { path: '/premium', Component: PremiumSelect },

  // ── Mobile PWA App ────────────────────────────────────────────────────────
  {
    path: '/app',
    Component: MobileLayout,
    children: [
      { path: 'dashboard',    Component: Dashboard },
      { path: 'alert',        Component: AlertScreen },
      { path: 'alerts',       Component: Notifications },
      { path: 'payout',       Component: PayoutScreen },
      { path: 'claims',       Component: ClaimsManagement },   // Enhanced claims management
      { path: 'policy',       Component: PolicyManagement },   // Policy management
      { path: 'premium-calc', Component: PremiumCalculator },  // Dynamic premium calculator
      { path: 'profile',      Component: Profile },
    ],
  },

  // ── Admin / Insurer Portal ────────────────────────────────────────────────
  { path: '/admin',       Component: AdminDashboard },
  { path: '/admin/fraud', Component: FraudDetection },
]);
