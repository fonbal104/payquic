import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPause, FaPlay } from 'react-icons/fa6';
import brand from '../../config/brand';
import Button from '../ui/Button';
import useLocalizedPath from '../../lib/useLocalizedPath';

const INTERVAL = 6000;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Text slides over a fixed hero photo. Slides come from brand.heroSlides (i18n keys home.hero.<slide>.title/subtitle).
export default function HeroSlider() {
  const { t } = useTranslation();
  const lp = useLocalizedPath();
  const slides = brand.heroSlides ?? ['slide1'];
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion()); // no autoplay for reduced-motion users
  const [hold, setHold] = useState(false); // paused while hovering or focused

  useEffect(() => {
    if (!playing || hold || slides.length < 2) return undefined;
    const id = setTimeout(() => setActive((a) => (a + 1) % slides.length), INTERVAL);
    return () => clearTimeout(id); // restarts after a manual change
  }, [active, playing, hold, slides.length]);

  return (
    <div role="region" aria-roledescription="carousel" aria-label={brand.name}
      onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      {/* All slides share one grid cell so the height never jumps between slides */}
      <div className="grid">
        {slides.map((k, i) => {
          const on = i === active;
          const Title = on ? 'h1' : 'div';
          return (
            <div key={k} aria-hidden={!on} inert={on ? undefined : ''}
              className={`col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none ${on ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
              <Title className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">{t(`home.hero.${k}.title`)}</Title>
              <p className="mt-5 text-lg">{t(`home.hero.${k}.subtitle`)}</p>
              <Button to={lp('/about')} variant="glass" className="mt-7">{t('shared.moreInfo')}</Button>
            </div>
          );
        })}
      </div>
      {slides.length > 1 && (
        <div className="mt-4 flex items-center gap-1">
          {slides.map((k, i) => (
            <button key={k} type="button" onClick={() => setActive(i)} aria-label={t('shared.slider.goTo', { n: i + 1 })} aria-current={i === active} className="p-2">
              <span className={`block h-2.5 w-2.5 rounded-full ${i === active ? 'bg-white' : 'bg-white/40'}`} />
            </button>
          ))}
          <button type="button" onClick={() => setPlaying(!playing)} aria-label={t(playing ? 'shared.slider.pause' : 'shared.slider.play')}
            className="ml-3 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-xs">
            {playing ? <FaPause aria-hidden /> : <FaPlay aria-hidden />}
          </button>
        </div>
      )}
    </div>
  );
}
