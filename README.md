# @nera-static/starter-blog

[![Test](https://github.com/seebaermichi/nera-starter-blog/actions/workflows/test.yml/badge.svg)](https://github.com/seebaermichi/nera-starter-blog/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/@nera-static/starter-blog)](https://www.npmjs.com/package/@nera-static/starter-blog)

📖 **Documentation:** [nera.js.org](https://nera.js.org)

A ready-to-edit blog for the [Nera](https://github.com/seebaermichi/nera)
static site generator, on
[`@nera-static/theme-blog`](https://www.npmjs.com/package/@nera-static/theme-blog):
three sample posts, tags with a page per tag, an archive by year, prev/next
between posts, an Atom feed, a sitemap, code blocks, a menu, responsive images,
social links and imprint and privacy placeholders. No JavaScript, no
third-party requests; a fresh site passes `nera build --check` and
`nera validate` without a single finding.

## Usage

```bash
npx @nera-static/nera new my-blog --starter blog
npx @nera-static/nera new my-blog --starter blog --name "My Blog" --lang de
```

`--name` and `--lang` set `name` and `lang` in `config/app.yaml`; a new
language gets a copy of the English `translations:` entry to translate.

## What you get

- `pages/index.md` (home), `archive.md`, `about.md`, and three posts in
  `pages/posts/`
- `pages/imprint.md`, `pages/privacy.md`: **placeholders, not legal texts**
- `config/app.yaml`: name, language, `theme: blog`, `origin`, the theme texts
- `config/theme.yaml`, `tags.yaml`, `navigation.yaml`, `images.yaml`,
  `code-blocks.yaml`, `social-media-links.yaml`
- `theme/views/partials/`: the theme's seams, filled with the plugins' output
- `theme/views/vendor/`: the plugins' published templates
- plugins: tags, page-pagination, feed, sitemap, code-blocks, navigation,
  images, social-media-links

## German texts for `--lang de`

Replace the copied `de:` entry in `config/app.yaml` with:

```yaml
    de:
        app_description: Ein Blog, gebaut mit Nera
        app_keywords: nera, blog, statische Website
        language_name: Deutsch
        Skip to content: Zum Inhalt springen
        Main navigation: Hauptnavigation
        Language: Sprache
        Legal: Rechtliches
        Recent posts: Neueste Beiträge
        All posts: Alle Beiträge
        Published: Veröffentlicht
        Updated: Aktualisiert
        By: Von
        Imprint: Impressum
        Privacy: Datenschutz
        Pagination: Blätternavigation
        Read more: Weiterlesen
```

## Requirements

- `@nera-static/nera` 1.11.0 or later, with `@nera-static/core` 4.15.0 or
  later (the theme's floor; a fresh install brings the newest)
- Node.js `>=22.12.0` (its bundled npm 10.9 or later)

## License

MIT

## First steps

After `nera new` the files are yours: a starter has no update path.

1. Replace `origin: https://example.com` in `config/app.yaml` with your
   site's real address. The feed and the sitemap are built from it.
2. Replace `pages/imprint.md` and `pages/privacy.md` with your own legal texts.
3. Replace the social link in `config/social-media-links.yaml`, the about
   page and the sample posts.
