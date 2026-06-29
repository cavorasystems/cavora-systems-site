# Cavora Systems — Marketing Site

Cinematic scrollytelling site for Cavora Systems (conversion websites, AI agents & automation).
Vanilla HTML/CSS/JS, no build step.

- **Desktop hero:** three video clips scroll-scrubbed + crossfaded into the logo reveal.
- **Mobile hero:** the same clips play as an auto-advancing cinematic montage (iOS-safe — no
  programmatic video seeking), collapsing to a single viewport.
- Sections: Work · Services · Process · Why Cavora · CTA.

## Run locally
Videos need range-capable serving for the scrub:
```bash
python3 serve.py 8003   # http://127.0.0.1:8003
```

## Deploy
Static — drag to Netlify, or it ships via GitHub Pages from `main`.
