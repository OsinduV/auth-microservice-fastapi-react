import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const FormField = ({ label, id, error, className = '', ...props }: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        className={[
          'w-full rounded border bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition',
          'focus:outline-none focus:ring-1',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
            : 'border-slate-300 focus:border-slate-500 focus:ring-slate-500',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;
