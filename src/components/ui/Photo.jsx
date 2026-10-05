import brand from '../../config/brand';

// Shows brands/<brand>/assets/images/<name>.jpg|png|webp, or a labelled placeholder until it exists.
export default function Photo({ name, alt = '', className = '' }) {
  const src = brand.images[name];
  const fit = /\bobject-(contain|cover|fill)/.test(className) ? '' : 'object-cover'; // let callers override the fit
  if (src) return <img src={src} alt={alt} loading="lazy" className={`${fit} ${className}`} />;
  return (
    <div role="img" aria-label={alt || name} className={`flex items-center justify-center bg-gradient-to-br from-brand-accent/30 to-brand-dark/20 text-sm text-brand-dark/60 ${className}`}>
      {name}.jpg
    </div>
  );
}
