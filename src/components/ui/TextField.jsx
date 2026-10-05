import { forwardRef } from 'react';

// Pass `textarea` for a textarea, or `select` with <option> children for a dropdown.
const TextField = forwardRef(function TextField({ label, error, textarea, select, children, ...props }, ref) {
  const Tag = textarea ? 'textarea' : select ? 'select' : 'input';
  return (
    <div className="mb-5">
      <label htmlFor={props.name} className="mb-1 block text-sm font-semibold text-brand-dark">{label}</label>
      <Tag ref={ref} id={props.name} aria-invalid={!!error} rows={textarea ? 4 : undefined}
        className="w-full rounded-md bg-slate-100 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-accent" {...props}>
        {children}
      </Tag>
      {error && <p role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});
export default TextField;
