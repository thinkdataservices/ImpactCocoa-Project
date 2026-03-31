import { useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

export interface LoginFormValues {
  email: string;
  password: string;
}

export function useLoginForm() {
  const intl = useIntl();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const t = (id: string) => intl.formatMessage({ id: `auth.login.${id}` });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      // TODO: call auth API
      console.log("Login submit:", { email, password });

      // TODO: on success, navigate to dashboard
      // navigate("/dashboard");
    } catch {
      setError(t("error.generic"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    error,
    handleSubmit,
    navigate,
    t,
  };
}
