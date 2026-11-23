# Devotion Gallery archive

A static archive of Devotion Gallery (Williamsburg, Brooklyn, 2009–2013), served by GitHub Pages at **https://devotiongallery.com** (`CNAME`). Hand-written HTML and one stylesheet. No build step, no frameworks, no CDN.

## Facts to respect

- **areyoudevoted.com is not ours any more.** Never link to it, load anything from it, or keep an `@areyoudevoted.com` email address. Old links to it become internal links; old email addresses and RSVP/contact lines are removed.
- **Phoenix Perry founded, funded and curated Devotion.** Credit her as curator of the space on the About page only. Show and event pages have no "Curated by …" lines.
- **Photo credits only where known:** "Photo: Phillip Stearns" on his Flickr photos of Algorithmic Unconscious; "Photos: Rich Orris" at the end of the Multi-User Art post.
- **Keep the words.** Clean the markup, but don't change artist statements, credits or dates without asking Phoenix.
- The About page contact line is "Email Phoenix at contact at phoenixperry.com".

## Structure

- `index.html`, `about/`, `artists/`, `exhibitions/`, `events/`, `blog/`, `press/`, `learn/`, `videos/`: each section has an `index.html` and one folder per post (`<section>/<slug>/index.html`).
- `assets/css/style.css`: the only stylesheet.
- `assets/img/<section>/<slug>/`: web-sized images (max 1600px) and thumbnails. Never commit raw, PSD or zip masters.
- Internal links are root-relative (`/exhibitions/<slug>/`).

## House style (adapted from Held in Common)

- **CSS order:** 1 Tokens (`:root` custom properties: colours, fonts, rem type scale, 4px spacing scale, `--focus`), 2 Base (element defaults in `:where()`), 3 Shared patterns, 4 Site frame, 5 Page parts, 6 Small screens. Use tokens, not raw values. One declaration per line, a comment above each group, a blank line before each comment. No inline styles, no dead rules; hide things with the `hidden` attribute.
- **HTML:** semantic elements (`header`, `nav`, `main`, `article`, `footer`, ordered headings, lists). Every image has `alt` (`alt=""` if decorative), plus `width` and `height`. Pages work without JavaScript.
- **Accessibility:** visible focus ring, WCAG AA contrast, text sizes in rem.
- **JavaScript:** only `assets/js/lightbox.js` (photo viewer, a `<dialog>`). Every photo must still work as a plain link without it. Keep any JS small, commented, and toggling attributes rather than writing styles.
- **Writing:** British spelling, plain language. Every CSS/JS file starts with a comment saying what it's for.
- **Git:** branch from the published branch, one topic per commit, plain-sentence commit subjects. Never push or force-push without asking Phoenix.
- **Check visually:** screenshots at 1280px and 390px wide for each page template, before and after a visual change.
