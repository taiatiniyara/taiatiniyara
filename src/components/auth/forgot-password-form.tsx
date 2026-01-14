import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { AuthFormWrapper } from '@/components/ui/auth-form-wrapper';
import { ErrorMessage } from '@/components/ui/error-message';
import { SuccessMessage } from '@/components/ui/success-message';
import { AuthInputField } from '@/components/ui/auth-input-field';
import { useAuthForm } from '@/hooks/useAuthForm';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const { loading, error, success, handleSubmit } = useAuthForm();
  const { resetPassword } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(() => resetPassword(email));
  };

  if (success) {
    return (
      <SuccessMessage
        icon="email"
        title="Check Your Email"
        message={`We've sent a password reset link to ${email}`}
      >
        <Link to="/login">
          <Button variant="outline" className="w-full">
            Back to Login
          </Button>
        </Link>
      </SuccessMessage>
    );
  }

  return (
    <AuthFormWrapper
      title="Reset Password"
      description="Enter your email to receive a password reset link"
    >
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
        {error && <ErrorMessage message={error} />}

        <AuthInputField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={loading}
        />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <div className="text-center text-sm">
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
    </AuthFormWrapper>
  );
}
