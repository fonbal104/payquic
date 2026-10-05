# Brand site template (React + Vite + Vercel Functions)

## New client
Copy `brands/payquic` to `brands/<client>`: edit `brand.config.js`, replace `assets/logo.png`, add photos to `assets/images/`
(hero, whoWeAre, consultation, currentClient, newClient, aboutBuilding, mission, values, cta1-3, login), set `VITE_BRAND=<client>`.
Legal pages: `src/content/legal/*.en.md` use {{legalName}}, {{domain}}, {{email}}, {{country}}, {{governingLaw}}.

## Local setup
1. `npm install`; copy `.env.example` to `.env.local` and fill it in.
2. `npm run migrate` creates the tables. `npm run seed:admin -- you@example.com admin` prints a set-password link.
3. `npx vercel dev` runs the site and `/api` together (plain `npm run dev` has no API).

## Japanese
`npm run translate` fills missing Japanese strings and legal pages using DeepL (existing text is kept; `-- --force` overwrites). Have a native speaker review.

## Deploy (Vercel)
Add the Neon integration, set the variables from `.env.example` (SITE_URL is also used to build sitemap.xml and robots.txt), run `npm run migrate` against production.
Admins see an Inquiries inbox at `/admin/inquiries`.

## Favicon
Drop `favicon.png` (square, 512x512 recommended), `favicon.ico` or `favicon.svg` into `brands/<client>/assets/`.

## Automatic Japanese legal pages
Set `DEEPL_API_KEY` in Vercel: every build translates new UI text and any legal page whose English changed (`npm run build` does it; no key = skipped).
Commit the generated `*.ja.md` files so deploys don't re-translate (and re-spend DeepL quota) every time. A `*.ja.md` without the `<!-- source:... -->` first line is treated as hand-written and never overwritten.
