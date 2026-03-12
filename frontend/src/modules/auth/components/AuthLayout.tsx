import type { ReactNode } from 'react';

const FEATURES = [
  {
    label: 'Equity Valuation',
    desc: 'DCF, comparables & intrinsic value modelling',
  },
  {
    label: 'Sentiment Analysis',
    desc: 'NLP-powered real-time market signal processing',
  },
  {
    label: 'Fraud Detection',
    desc: 'Anomaly detection across transactional patterns',
  },
  {
    label: 'Portfolio Intelligence',
    desc: 'AI-driven allocation & risk recommendations',
  },
];

const TICKERS = [
  { sym: 'SPX', val: '5,204.34', chg: '+0.42%', up: true },
  { sym: 'NDX', val: '18,139.22', chg: '+0.61%', up: true },
  { sym: 'VIX', val: '14.23', chg: '−1.87%', up: false },
  { sym: 'DXY', val: '104.12', chg: '+0.09%', up: true },
];

const CheckIcon = () => (
  <svg
    className="h-3 w-3 text-blue-400"
    fill="none"
    viewBox="0 0 12 12"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="1,6 4,9 11,2" />
  </svg>
);

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left dark panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[460px] xl:w-[500px] shrink-0 flex-col justify-between bg-[#0b1120] px-10 py-12 select-none">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            {/* Logo mark */}
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="34" height="34" rx="5" fill="#162035" />
              <polyline
                points="4,24 10,16 17,20 23,11 30,7"
                stroke="#3b7cef"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="30" cy="7" r="2.5" fill="#3b7cef" />
            </svg>
            <span className="text-white text-[17px] font-semibold tracking-tight">
              MarketInsight DSS
            </span>
          </div>
          <p className="text-blue-500 text-[10px] font-semibold tracking-[0.18em] uppercase ml-[46px] mb-10">
            AI-Driven Stock Analysis Platform
          </p>

          <h2 className="text-white text-[22px] font-semibold leading-snug mb-3">
            Institutional-grade intelligence<br />for capital markets.
          </h2>
          <p className="text-slate-400 text-[13px] leading-relaxed mb-10">
            Access real-time equity analysis, sentiment signals, and
            portfolio optimisation tools trusted by investment professionals.
          </p>

          {/* Feature list */}
          <ul className="space-y-5">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-sm bg-[#162035] border border-blue-900/60 flex items-center justify-center">
                  <CheckIcon />
                </div>
                <div>
                  <p className="text-white text-[13px] font-medium">{f.label}</p>
                  <p className="text-slate-500 text-[12px] mt-0.5">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Market data strip */}
        <div>
          <div className="border-t border-white/8 pt-6 mb-4">
            <p className="text-slate-600 text-[9px] font-semibold tracking-[0.2em] uppercase mb-3">
              Market Overview
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {TICKERS.map((t) => (
                <div key={t.sym} className="bg-white/4 border border-white/6 rounded px-3 py-2.5">
                  <p className="text-[9px] font-semibold tracking-[0.15em] text-slate-500 uppercase mb-0.5">
                    {t.sym}
                  </p>
                  <p className="text-white text-[13px] font-semibold tabular-nums">{t.val}</p>
                  <p
                    className={`text-[11px] font-medium tabular-nums ${
                      t.up ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {t.chg}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-slate-700 text-[10px] leading-relaxed">
            Indicative data — for display purposes only. Not investment advice.
          </p>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f7f8fb] px-4 py-12 sm:px-8">
        {/* Mobile brand (hidden on lg+) */}
        <div className="lg:hidden mb-8 text-center select-none">
          <span className="text-xl font-semibold tracking-tight text-slate-900">
            MarketInsight DSS
          </span>
          <p className="text-[10px] text-slate-400 tracking-[0.18em] uppercase font-semibold mt-1">
            AI-Driven Stock Analysis Platform
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-sm bg-white border border-slate-200/80 rounded-md shadow-sm px-8 py-8">
          {children}
        </div>

        <p className="mt-6 text-[11px] text-slate-400">
          &copy; {new Date().getFullYear()} MarketInsight DSS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
