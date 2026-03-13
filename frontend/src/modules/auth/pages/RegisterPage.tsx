import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import { useRegisterForm } from '../hooks/useRegisterForm';

interface FieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterPage = () => {
  const { submit, isLoading, error, success } = useRegisterForm();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await submit({ email, password, confirmPassword });
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="py-4 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Account created</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your account has been created successfully.
          </p>
          <p className="mt-3 text-sm text-slate-400">Redirecting to sign in…</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Create account</h2>
        <p className="mt-1 text-sm text-slate-500">Register for institutional access</p>
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
          id="reg-email"
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
          id="reg-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          disabled={isLoading}
        />

        <PasswordField
          id="reg-confirm"
          label="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
          placeholder="Repeat your password"
          autoComplete="new-password"
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
              Creating account…
            </span>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 text-center">
        <p className="text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
