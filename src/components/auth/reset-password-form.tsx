import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { AuthFormWrapper } from '@/components/ui/auth-form-wrapper';
import { ErrorMessage } from '@/components/ui/error-message';
import { AuthInputField } from '@/components/ui/auth-input-field';
import { useAuthForm } from '@/hooks/useAuthForm';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { loading, error, validatePassword, handleSubmit } = useAuthForm();
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password, confirmPassword)) return;

    await handleSubmit(
      () => updatePassword(password),
      () => navigate({ to: '/profile' })
    );
  };

  return (
    <AuthFormWrapper
      title="Set New Password"
      description="Enter your new password below"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {error && <ErrorMessage message={error} />}

        <AuthInputField
          id="password"
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
        />

        <AuthInputField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
