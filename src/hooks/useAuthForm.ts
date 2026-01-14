import { useState } from "react";
import { FORM_VALIDATION } from "@/lib/constants";

/**
 * Shared hook for authentication forms
 * Consolidates common state management and validation logic
 */
export function useAuthForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validatePassword = (password: string, confirmPassword?: string) => {
    if (confirmPassword !== undefined && password !== confirmPassword) {
      setError(FORM_VALIDATION.passwordMismatchError);
      return false;
    }
    
    if (password.length < FORM_VALIDATION.minPasswordLength) {
      setError(FORM_VALIDATION.passwordError);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (submitFn: () => Promise<{ error: any }>, onSuccessCallback?: () => void) => {
    setError(null);
    setLoading(true);

    const { error: submitError } = await submitFn();

    if (submitError) {
      setError(submitError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      onSuccessCallback?.();
    }
  };

  return {
    loading,
    error,
    success,
    setError,
    setSuccess,
    validatePassword,
    handleSubmit,
  };
}
