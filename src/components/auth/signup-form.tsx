import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { AuthFormWrapper } from "@/components/ui/auth-form-wrapper";
import { ErrorMessage } from "@/components/ui/error-message";
import { SuccessMessage } from "@/components/ui/success-message";
import { AuthInputField } from "@/components/ui/auth-input-field";
import { useAuthForm } from "@/hooks/useAuthForm";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { loading, error, success, validatePassword, handleSubmit } = useAuthForm();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password, confirmPassword)) return;

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    await handleSubmit(
      () => signUp(email, password, { fullName, role: "user" }),
      () => setTimeout(() => navigate({ to: "/login" }), 2000)
    );
  };

  if (success) {
    return (
      <SuccessMessage
        icon="check"
        title="Account Created!"
        message="Check your email to verify your account. Redirecting to login..."
      />
    );
  }

  return (
    <AuthFormWrapper
      title="Create Account"
      description="Sign up for a new account"
    >
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
        {error && <ErrorMessage message={error} />}

        <AuthInputField
          id="firstName"
          label="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="John"
          disabled={loading}
        />

        <AuthInputField
          id="lastName"
          label="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Doe"
          disabled={loading}
        />

        <AuthInputField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={loading}
        />

        <AuthInputField
          id="password"
          label="Password"
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
          {loading ? "Creating account..." : "Sign Up"}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthFormWrapper>
  );
}
