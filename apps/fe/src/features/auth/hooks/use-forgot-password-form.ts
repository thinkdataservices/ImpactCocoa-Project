import { useState } from "react";
import { useIntl } from "react-intl";

export function useForgotPasswordForm() {
  const intl = useIntl();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const t = (id: string, values?: Record<string, string>) =>
    intl.formatMessage({ id: `auth.forgotPassword.${id}` }, values);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      // TODO: call forgot password API
      console.log("Forgot password submit:", { email });

      setSent(true);
    } catch {
      setError(t("error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    sent,
    setSent,
    error,
    handleSubmit,
    t,
  };
}
