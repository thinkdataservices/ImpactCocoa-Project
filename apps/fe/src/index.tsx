import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import {
  AuthLayout,
  ForgotPasswordForm,
  LoginForm,
  MagicLinkForm,
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
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route path="/magic-link" element={<MagicLinkForm />} />
            </Route>
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </IntlProvider>
    </StrictMode>,
  );
}
