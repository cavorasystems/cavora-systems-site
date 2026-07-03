# Cavora Systems — Project Standards

Single-page marketing site for Cavora Systems (Victoria, BC). Vanilla HTML/CSS/JS, no build step, no framework. Deploy by pushing to `main` (GitHub Pages) or drag to Netlify.

## Stack

- Pure HTML5 / CSS3 / vanilla JS — no npm, no bundler, no TypeScript
- One HTML file (`index.html`), one CSS file (`css/styles.css`), one JS file (`js/main.js`)
- Google Fonts: Cormorant Garamond (serif) + Inter (sans-serif)
- Contact form: Formspree (`https://formspree.io/f/<ID>`)
- Domain: `https://cavorasystems.com`

## Every HTML page must include

### Head — meta tags
```html
<link rel="canonical" href="https://cavorasystems.com/" />

<!-- Open Graph — og:image MUST be an absolute URL, never relative -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Cavora Systems" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://cavorasystems.com/assets/img/poster3.jpg" />
<meta property="og:url" content="https://cavorasystems.com/" />

<!-- Twitter / X card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="https://cavorasystems.com/assets/img/poster3.jpg" />

<!-- Icons -->
<link rel="icon" type="image/png" href="assets/img/favicon-128.png" />
<link rel="apple-touch-icon" href="assets/img/favicon-128.png" />
```

### Head — Schema.org structured data
Always include LocalBusiness / ProfessionalService JSON-LD for SEO:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Cavora Systems",
  "url": "https://cavorasystems.com",
  "email": "casey@cavorasystems.com",
  "description": "...",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Victoria",
    "addressRegion": "BC",
    "addressCountry": "CA"
  }
}
</script>
```

### Body structure
```html
<nav aria-label="Main navigation">...</nav>
<main id="main-content">
  <!-- all page content goes here -->
</main>
<footer>...</footer>
```

### Content sections
Every `<section>` needs `aria-labelledby` pointing to its heading ID:
```html
<section id="services" aria-labelledby="services-heading">
  <h2 id="services-heading">...</h2>
</section>
```

## Contact / CTA

Never use a bare `mailto:` link as the only contact method — it silently fails on many mobile devices. Always use a form.

The contact form uses Formspree. Replace `YOUR_FORM_ID` with the actual ID from formspree.io:
```html
<!-- SETUP: formspree.io → New Form → copy ID → replace YOUR_FORM_ID -->
<form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <div class="form-row">
    <div class="form-field">
      <label for="cf-name">Your Name</label>
      <input type="text" id="cf-name" name="name" required />
    </div>
    <div class="form-field">
      <label for="cf-email">Email Address</label>
      <input type="email" id="cf-email" name="email" required />
    </div>
  </div>
  <div class="form-field">
    <label for="cf-business">Business Name</label>
    <input type="text" id="cf-business" name="business" />
  </div>
  <div class="form-field">
    <label for="cf-message">Tell us about your business</label>
    <textarea id="cf-message" name="message" rows="4" required></textarea>
  </div>
  <button type="submit" class="cta-btn form-submit">Start the Conversation</button>
</form>
```

## Video

- HTML default: `preload="metadata"` (loads only duration/poster, not video data)
- Desktop scroll-scrub: JS sets `preload="auto"` and calls `v.load()` inside `initScrub()` so full buffering happens only on pointer devices
- Mobile montage: `v.play()` triggers download on demand — no change needed
- Never use `preload="auto"` in HTML — it front-loads all video data on every device

## JavaScript

- Mobile detection: `matchMedia('(pointer: coarse)').matches` only — do NOT mix in `innerWidth` pixel checks
- Video clip durations (`DUR`) should ideally be read from `v.duration` on `loadedmetadata` rather than hardcoded magic numbers

## Required files at repo root

Every project ships these:
- `robots.txt` — allow all, point to sitemap
- `sitemap.xml` — list all public URLs with `<lastmod>`
- `404.html` — branded error page (matches site design, includes a "Back to home" link)
- `CLAUDE.md` — this file

## Design tokens (CSS custom properties)

```css
--gold:        #C9A96E
--gold-bright: #E8C97A
--green:       #1B4332
--green-light: #2D6A4F
--black:       #080808
--near:        #0C0C0C
--panel:       #101010
--white:       #F5F0E8
--dim:         rgba(245,240,232,0.58)
--faint:       rgba(245,240,232,0.32)
--line:        rgba(201,169,110,0.16)
--serif:       'Cormorant Garamond', Georgia, serif
--sans:        'Inter', system-ui, -apple-system, sans-serif
--maxw:        1180px
--ease:        cubic-bezier(0.22, 1, 0.36, 1)
```

## Analytics

The site needs analytics before it can be measured or improved. When adding analytics, use a privacy-respecting tool (Plausible, Fathom, or Umami — one `<script>` tag, GDPR-compliant). Do not add Google Analytics without confirming with Casey first.

## Accessibility checklist

Before shipping any page:
- [ ] `<main>` landmark wraps page content
- [ ] Every `<section>` has `aria-labelledby` pointing to its heading
- [ ] `<nav>` has `aria-label`
- [ ] All form inputs have `<label>` elements with matching `for` / `id`
- [ ] `prefers-reduced-motion` is respected (animations disabled)
- [ ] Images have descriptive `alt` text (decorative images use `alt=""`)
- [ ] `apple-touch-icon` is declared
- [ ] `og:image` uses an absolute URL

## Client info

- **Business:** Cavora Systems — boutique digital agency
- **Owner:** Casey Jackson — casey@cavorasystems.com
- **Location:** Victoria, BC, Canada
- **Target clients:** Trades and service businesses (plumbers, electricians, contractors, etc.)
- **Services:** Conversion websites, AI automation agents, full digital stacks
- **Brand voice:** Confident, cinematic, direct — no buzzwords, no fluff
