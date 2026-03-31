import { useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

export function useResetPasswordForm() {
  const intl = useIntl();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const t = (id: string) =>
    intl.formatMessage({ id: `auth.resetPassword.${id}` });

  const requirements = [
    { key: "minLength", met: password.length >= 8 },
    { key: "uppercase", met: /[A-Z]/.test(password) },
    { key: "numberOrSpecial", met: /[0-9!@#$%^&*]/.test(password) },
  ];

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("error.mismatch"));
      return;
    }

    if (!requirements.every((r) => r.met)) {
      setError(t("error.tooShort"));
      return;
    }

    setIsLoading(true);

    try {
      // TODO: call reset password API
      console.log("Reset password:", { password });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch {
      setError(t("error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    success,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    requirements,
    handleResetPassword,
    t,
  };
}
