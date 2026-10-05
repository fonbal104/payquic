import { FaFacebook, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import brand from '../../config/brand';

export default function TopBar() {
  return (
    <div className="bg-brand-secondary text-sm text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex gap-8">
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
          <a href={`tel:${brand.phone.replace(/\s/g, '')}`} className="hidden sm:inline">{brand.phone}</a>
        </div>
        <div className="flex gap-4 text-lg">
          <a href={brand.social.facebook} aria-label="Facebook"><FaFacebook /></a>
          <a href={brand.social.twitter} aria-label="X"><FaXTwitter /></a>
          <a href={brand.social.youtube} aria-label="YouTube"><FaYoutube /></a>
        </div>
      </div>
    </div>
  );
}
