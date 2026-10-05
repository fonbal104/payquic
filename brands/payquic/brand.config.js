// Everything that changes per client lives in this file + the assets folder.
import logo from './assets/logo.png';

export default {
  name: 'PayQuic',          // display / site name
  legalName: 'Pay Quic',    // used in Privacy Policy & Terms
  domain: 'pay-quic.com',
  email: 'info@pay-quic.com',
  phone: '+1 213 142 2522',
  merchantDescriptor: 'V Payment pay-quic.com', // shown on the Current Client Inquiry page
  businessTypes: ['retail', 'ecommerce', 'services', 'travel', 'other'], // TODO confirm real options (labels: i18n inquiry.businessTypes)
  currencies: ['USD', 'JPY', 'EUR', 'GBP', 'AUD', 'PHP', 'SGD'],    // TODO confirm real options
  heroSlides: ['slide1', 'slide2'], // home hero text slides: add keys here and under home.hero in the i18n files
  governingLaw: { en: 'Philippines', ja: 'フィリピン' },
  country: { en: 'the Philippines', ja: 'フィリピン' }, // data-transfer wording in the Privacy Policy
  logo,
  social: { facebook: '#', twitter: '#', youtube: '#' },
  colors: {
    dark: '#0a2540',       // header, footer, headings
    secondary: '#23707f',  // top bar
    accent: '#10cdc8',     // active links, highlights
    cta: '#2fae6d',        // primary buttons
  },
  // Optional per-language copy overrides (merged over src/i18n/locales)
  copy: { en: {}, ja: {} },
  // Optional image overrides (hero, section photos) added in phase 2
  rating: { score: '4.7', reviews: 871 },
  images: {}, // or drop files named hero.jpg, whoWeAre.jpg... into assets/images/
};
