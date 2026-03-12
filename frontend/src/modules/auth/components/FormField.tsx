import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const FormField = ({ label, id, error, className = '', ...props }: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-500"
      >
        {label}
      </label>
      <input
        id={id}
        className={[
          'w-full border bg-white px-3 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 transition-colors duration-150 rounded-sm',
          'focus:outline-none',
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-slate-300 focus:border-slate-700',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-600">
          <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
