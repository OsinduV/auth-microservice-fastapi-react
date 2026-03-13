import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Brand header */}
      <div className="mb-8 text-center select-none">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="h-7 w-1 rounded-full bg-slate-800" />
          <span className="text-xl font-semibold tracking-tight text-slate-900">
            MarketInsight DSS
          </span>
        </div>
        <p className="text-sm text-slate-400 tracking-wide uppercase font-medium">
          AI-Driven Stock Analysis Platform
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm px-8 py-8">
        {children}
      </div>

      <p className="mt-6 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} MarketInsight DSS. All rights reserved.
      </p>
    </div>
  );
};

export default AuthLayout;
