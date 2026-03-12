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
        <div className="py-6 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-emerald-50 border border-emerald-200">
            <svg
              className="h-7 w-7 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-emerald-600 mb-2">
            Registration Successful
          </p>
          <h2 className="text-[18px] font-semibold tracking-tight text-slate-900">Account activated</h2>
          <p className="mt-2 text-[13px] text-slate-500 leading-relaxed">
            Your institutional account has been created.<br />You may now access the platform.
          </p>
          <p className="mt-4 text-[11px] text-slate-400">Redirecting to sign in…</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-slate-400">
            New Account Registration
          </span>
        </div>
        <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">Create account</h2>
        <p className="mt-1 text-[13px] text-slate-500">Register for institutional platform access</p>
      </div>

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-sm border border-red-200 bg-red-50 px-3.5 py-3 text-[12px] text-red-700"
        >
          <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
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
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          disabled={isLoading}
        />

        <PasswordField
          id="reg-confirm"
          label="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          disabled={isLoading}
        />

        {/* Password policy note */}
        <p className="-mt-1 text-[11px] text-slate-400">
          Password must be at least 8 characters.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 w-full flex items-center justify-center gap-2 rounded-sm bg-[#0b1120] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#162035] focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <svg
                className="h-3.5 w-3.5 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Trust badge */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        <svg className="h-3 w-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-[10px] text-slate-400 tracking-wide">
          256-bit TLS encrypted session
        </span>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5 text-center">
        <p className="text-[12px] text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#1a3a8a] hover:underline hover:underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
