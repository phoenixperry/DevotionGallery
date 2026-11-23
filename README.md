# Devotion Gallery archive

The archive of Devotion Gallery, 54 Maujer Street, Williamsburg, Brooklyn (2009–2014), at **https://devotiongallery.com**.

It's a plain static site: hand-written HTML pages, one stylesheet and web-sized images, served by GitHub Pages. There's no build step and no framework. The only JavaScript is `assets/js/lightbox.js`, a small photo viewer; without it, every photo is still a plain link to the full image.

## How it's organised

```
index.html                 home: the 2009–2014 memorial
about/                     about the gallery
exhibitions/<slug>/        one folder per exhibition
artists/<slug>/            one folder per artist, listing their shows at Devotion
events/<slug>/             events
learn/<slug>/              classes and workshops (from the gallery site and learn.areyoudevoted.com)
learn/teachers/<slug>/     teacher bios from the learn site
learn/goodies/<slug>/      offers from the learn site
blog/, press/, videos/     the same pattern
assets/css/style.css       the only stylesheet
assets/js/lightbox.js      the photo viewer (opens linked images in a dialog)
assets/video/              short videos from the gallery
assets/img/<section>/<slug>/   images for each page (max 1600px; thumbnails end in -thumb)
assets/files/              PDFs the old pages linked to
feed.xml, sitemap.xml, robots.txt, 404.html, CNAME
```

Each section's `index.html` lists its pages. Every post page has the section list beside it and previous/next links underneath.

**Old addresses still work.** Files such as `exhibitions/2012/4/2/nicole-aptekar-expanded-taxonomy.html` are small pages that send visitors to the new address.

## Adding or changing a page

1. Copy a page of the same kind (for example `exhibitions/lara-grant/index.html`) to a new folder named after the page.
2. Change the `<title>`, the `description` and `canonical` tags, the heading, the date and the text inside `<div class="prose">`.
3. Put its images in `assets/img/<section>/<slug>/`, at most 1600px on the long side, and give every image `alt` text plus `width` and `height`.
4. Add a card for it to the section's `index.html`, and its link to the sidebar list on the other pages in that section.
5. Check it locally (below).

## Checking it locally

From this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Links start with `/`, so open the site from this folder rather than as files.

To lint the CSS (the first run installs the pinned stylelint in `tools/css-lint`):

```
./scripts/lint-css.sh --fix
./scripts/lint-css.sh
```

## Style rules

See `CLAUDE.md` for the rules this site follows: credits, the lost areyoudevoted.com domain, and the CSS and accessibility style.

## History

- The original Squarespace v5 mirror is kept in git as the tag `squarespace-mirror-2014`.
- The version published before this rebuild is the tag `published-before-rebuild`.
- areyoudevoted.com now belongs to someone else, so nothing here links to it.
