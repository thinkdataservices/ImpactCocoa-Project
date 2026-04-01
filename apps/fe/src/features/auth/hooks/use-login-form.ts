import { useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

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

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      setError(authError.message || t("error.generic"));
      setIsSubmitting(false);
      return;
    }

    navigate("/");
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
