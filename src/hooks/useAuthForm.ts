import { useState } from "react";
import { FORM_VALIDATION } from "@/lib/constants";

interface AuthFormState {
  loading: boolean;
  error: string | null;
  success: boolean;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  validatePassword: (password: string, confirmPassword?: string) => boolean;
  handleSubmit: (
    submitFn: () => Promise<{ error: any }>,
    onSuccessCallback?: () => void
  ) => Promise<void>;
}

/**
 * Shared hook for authentication forms
 * Consolidates common state management and validation logic
 * @returns Auth form state and utility functions
 */
export function useAuthForm(): AuthFormState {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Validates password requirements and optional confirmation match
   * @param password - Password to validate
   * @param confirmPassword - Optional password confirmation to match
   * @returns true if valid, false otherwise
   */
  const validatePassword = (password: string, confirmPassword?: string): boolean => {
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

  /**
   * Handles form submission with loading and error states
   * @param submitFn - Async function that performs the submission
   * @param onSuccessCallback - Optional callback to execute on success
   */
  const handleSubmit = async (
    submitFn: () => Promise<{ error: any }>,
    onSuccessCallback?: () => void
  ): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      const { error: submitError } = await submitFn();

      if (submitError) {
        setError(submitError.message);
      } else {
        setSuccess(true);
        onSuccessCallback?.();
      }
    } finally {
      setLoading(false);
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
