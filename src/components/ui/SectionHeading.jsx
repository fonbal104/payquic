export default function SectionHeading({ eyebrow, title, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-cta">{eyebrow}</p>}
      <h2 className="text-3xl font-bold leading-tight text-brand-dark md:text-4xl">{title}</h2>
    </div>
  );
}
