export default function PageHero({ title, subtitle, align = 'center' }) {
  return (
    <section
      className="bg-brand-dark text-white"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)' }}
    >
      <div className={`mx-auto max-w-6xl px-6 pt-20 pb-28 ${align === 'center' ? 'text-center' : ''}`}>
        <h1 className="text-5xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-4 text-xl text-white/90">{subtitle}</p>}
      </div>
    </section>
  );
}
