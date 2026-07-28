# Freehold redesign

A production-oriented React/Vite redesign of the Freehold independent build studio site.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The output is written to `dist/` and uses relative asset paths, so it can be published to GitHub Pages or imported into another static hosting workflow.

## Enquiry form

The site intentionally does not ship with a fabricated email address or third-party form target.

1. Copy `.env.example` to `.env`.
2. Set `VITE_FORM_ENDPOINT` to a secure form handler endpoint.
3. Run `npm run build`.

The endpoint can be supplied by Formspree, Basin, Web3Forms, a serverless function, or an existing backend.

## Content that must be verified before launch

- Confirm that Groundskeeper, Thicket, Kilnwork, and Ledgerwork are real public product/case-study names.
- Replace the short privacy summary with a reviewed privacy notice.
- Add registered business details only after they are supplied and verified.
- Confirm the preferred public domain and canonical URL.
