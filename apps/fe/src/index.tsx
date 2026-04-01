import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import enMessages from './features/auth/i18n/en.json';
import './registerWebComponents';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <IntlProvider messages={enMessages} locale="en" defaultLocale="en">
        <BrowserRouter>
          <Routes>
            {/* Guest-only routes (redirect to / if logged in) */}
            <Route element={<GuestRoute />}>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
                <Route path="/magic-link" element={<MagicLinkForm />} />
              </Route>
            </Route>

            {/* Protected routes (redirect to /login if not logged in) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<App />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </IntlProvider>
    </StrictMode>,
  );
}
