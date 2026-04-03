import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import App from './App';
import {
  AuthLayout,
  ForgotPasswordForm,
  GuestRoute,
  LoginForm,
  MagicLinkForm,
  ProtectedRoute,
  ResetPasswordForm,
} from './features/auth';
import { DashboardPage } from './features/dashboard/pages/dashboard-page';
import { FarmersPage } from './features/farmers/pages/farmers-page';
import { FarmMapPage } from './features/farm-map/pages/farm-map-page';
import { InspectionsPage } from './features/inspections/pages/inspections-page';
import { TraceabilityPage } from './features/traceability/pages/traceability-page';
import { TrainingPage } from './features/training/pages/training-page';
import { EudrPage } from './features/eudr/pages/eudr-page';
import { ReportsPage } from './features/reports/pages/reports-page';
import { AdminUsersPage } from './features/admin/pages/admin-users-page';
import { AdminCooperativesPage } from './features/admin/pages/admin-cooperatives-page';
import { AdminSyncPage } from './features/admin/pages/admin-sync-page';
import { AdminAuditPage } from './features/admin/pages/admin-audit-page';

// i18n messages
import authEn from './features/auth/i18n/en.json';
import authFr from './features/auth/i18n/fr.json';
import sharedEn from './shared/i18n/en.json';
import sharedFr from './shared/i18n/fr.json';

import { type Locale, useLocale } from './shared/hooks/use-locale';
import './registerWebComponents';

const allMessages: Record<Locale, Record<string, string>> = {
  en: { ...sharedEn, ...authEn },
  fr: { ...sharedFr, ...authFr },
};

function Root() {
  const { locale, setLocale } = useLocale();

  return (
    <IntlProvider messages={allMessages[locale]} locale={locale} defaultLocale="en">
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Guest-only routes (redirect to / if logged in) */}
            <Route element={<GuestRoute />}>
              <Route element={<AuthLayout locale={locale} onLocaleChange={setLocale} />}>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
                <Route path="/magic-link" element={<MagicLinkForm />} />
              </Route>
            </Route>

            {/* Protected routes (redirect to /login if not logged in) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<App locale={locale} onLocaleChange={setLocale} />}>
                <Route index element={<DashboardPage />} />
                <Route path="farmers" element={<FarmersPage />} />
                <Route path="farm-map" element={<FarmMapPage />} />
                <Route path="inspections" element={<InspectionsPage />} />
                <Route path="traceability" element={<TraceabilityPage />} />
                <Route path="training" element={<TrainingPage />} />
                <Route path="eudr" element={<EudrPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="admin/users" element={<AdminUsersPage />} />
                <Route path="admin/cooperatives" element={<AdminCooperativesPage />} />
                <Route path="admin/sync" element={<AdminSyncPage />} />
                <Route path="admin/audit" element={<AdminAuditPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </IntlProvider>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Root />
    </StrictMode>,
  );
}
