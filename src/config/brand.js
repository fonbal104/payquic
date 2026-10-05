// Loads the active brand folder, chosen by VITE_BRAND (default: payquic).
const brands = import.meta.glob('../../brands/*/brand.config.js', { eager: true });
const files = import.meta.glob('../../brands/*/assets/images/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
const icons = import.meta.glob('../../brands/*/assets/favicon.{ico,png,svg}', { eager: true, query: '?url', import: 'default' });
const id = import.meta.env.VITE_BRAND || 'payquic';
const match = brands[`../../brands/${id}/brand.config.js`];
if (!match) throw new Error(`Brand "${id}" not found in /brands`);

// assets/images/hero.jpg -> images.hero
const images = Object.fromEntries(
  Object.entries(files)
    .filter(([p]) => p.includes(`/brands/${id}/`))
    .map(([p, url]) => [p.split('/').pop().replace(/\.[^.]+$/, ''), url])
);
const favicon = Object.entries(icons).find(([p]) => p.includes(`/brands/${id}/`))?.[1];
export default { ...match.default, favicon, images: { ...images, ...match.default.images } };
