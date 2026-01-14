import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { AuthFormWrapper } from "@/components/ui/auth-form-wrapper";
import { ErrorMessage } from "@/components/ui/error-message";
import { AuthInputField } from "@/components/ui/auth-input-field";
import { useAuthForm } from "@/hooks/useAuthForm";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, handleSubmit } = useAuthForm();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(
      () => signIn(email, password),
      () => navigate({ to: "/profile" })
    );
  };

  return (
    <AuthFormWrapper
      title="Welcome Back"
      description="Sign in to your account"
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

        <AuthInputField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
        />

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              to="/signup"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </form>
    </AuthFormWrapper>
  );
}
