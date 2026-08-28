# Teleneo font files

Drop the Teleneo `.woff2` files in this folder using these exact names and the
`@font-face` rules in `app/globals.css` will pick them up automatically —
no code changes needed:

- `Teleneo-Light.woff2` (weight 300)
- `Teleneo-Regular.woff2` (weight 400)
- `Teleneo-Medium.woff2` (weight 500)
- `Teleneo-Bold.woff2` (weight 700)

Until these files are present, the browser silently falls back to Geist
(the next font in the stack), so the app renders fine either way.

If your files use different names or only ship as `.woff`/`.otf`, update the
`src` lines in the `@font-face` blocks at the top of `app/globals.css` to match.
