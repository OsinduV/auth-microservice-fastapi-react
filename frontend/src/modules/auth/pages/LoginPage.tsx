import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import { useLoginForm } from '../hooks/useLoginForm';

interface FieldErrors {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const { submit, isLoading, error } = useLoginForm();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await submit({ email, password });
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Sign in</h2>
        <p className="mt-1 text-sm text-slate-500">Access your MarketInsight dashboard</p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormField
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          placeholder="analyst@institution.com"
          autoComplete="email"
          disabled={isLoading}
        />

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in…
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 text-center">
        <p className="text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
          >
            Create account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
