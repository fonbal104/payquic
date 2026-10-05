import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa6';

const styles = {
  cta: 'bg-brand-cta text-white',
  dark: 'bg-brand-dark text-white',
  glass: 'bg-white/20 text-white',
  secondary: 'bg-brand-secondary text-white',
};

export default function Button({ to, variant = 'cta', className = '', children }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold ${styles[variant]} ${className}`}>
      {children}<FaChevronRight className="text-xs" aria-hidden />
    </Link>
  );
}
