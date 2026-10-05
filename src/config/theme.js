import brand from './brand';

// Exposes brand colors as CSS variables (consumed by Tailwind tokens in index.css).
export function applyTheme() {
  const root = document.documentElement.style;
  Object.entries(brand.colors).forEach(([key, value]) => root.setProperty(`--brand-${key}`, value));
  document.title = brand.name;
  if (brand.favicon) {
    const types = { svg: 'image/svg+xml', ico: 'image/x-icon', png: 'image/png' };
    const ext = brand.favicon.split('?')[0].split('.').pop();
    const set = (rel) => {
      let l = document.head.querySelector(`link[rel="${rel}"]`);
      if (!l) { l = document.createElement('link'); l.rel = rel; document.head.appendChild(l); }
      l.href = brand.favicon; if (types[ext]) l.type = types[ext];
    };
    set('icon');
    if (ext === 'png') set('apple-touch-icon');
  }
}
