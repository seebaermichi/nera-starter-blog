# @nera-static/starter-blog

[![Test](https://github.com/seebaermichi/nera-starter-blog/actions/workflows/test.yml/badge.svg)](https://github.com/seebaermichi/nera-starter-blog/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/@nera-static/starter-blog)](https://www.npmjs.com/package/@nera-static/starter-blog)

📖 **Documentation:** [nera.js.org](https://nera.js.org)

A ready-to-edit blog for the [Nera](https://github.com/seebaermichi/nera)
static site generator, on
[`@nera-static/theme-blog`](https://www.npmjs.com/package/@nera-static/theme-blog)
2.x and its look "Plain": black on white, one system sans-serif, dates, the
author line and a post's facts in a margin on the left. Four sample posts, two
of them a series, tags with a page per tag, an archive by year, prev/next
between posts, search, an Atom feed, a sitemap, structured data (a
`BlogPosting` per post), canonical links, code blocks, a menu, responsive
images, social links and imprint and privacy placeholders. The only
JavaScript is the search script, on the search page; no third-party
requests. A fresh site passes `nera build --check` and `nera validate`
without a single finding.

## Usage

```bash
npx @nera-static/nera new my-blog --starter blog
npx @nera-static/nera new my-blog --starter blog --name "My Blog" --lang de
```

`--name` and `--lang` set `name` and `lang` in `config/app.yaml`; a new
language gets a copy of the English `translations:` entry to translate. The
sample pages stay in English.

## What you get

- `pages/index.md` (home), `archive.md`, `about.md`, `search.md`, and four
  posts in `pages/posts/`: `write-a-post.md` and `series-and-facts.md` (parts
  1 and 2 of the series "Start here", the second with `facts`), `tags.md`
  (with an image and an `author`) and `feed.md`; every post sets
  `is_post: true`
- `pages/imprint.md`, `pages/privacy.md`: **placeholders, not legal texts**
- `config/app.yaml`: name, language, `theme: blog`, `origin`, the theme and
  plugin texts
- `config/theme.yaml`: the code-blocks stylesheet, the footer links, and what
  the home shows: `blog.featured_series` (the series "Start here"),
  `blog.highlight_tag` (the newest posts tagged `writing`) and `author.name`,
  `author.bio`, `author.href` (the about block, and the byline of every post
  without its own `author`)
- `config/structured-data.yaml`: the site entity, a `Person` named like
  `author.name`, and `articles.key: is_post`, so every post with
  `is_post: true` gets a `BlogPosting`, in any language
- `config/search.yaml` (one index per language, the script loaded by the
  theme's `scripts-extra` seam), `plugin-order.yaml` (canonical links,
  structured data and search run last, so the tag pages get them too),
  `tags.yaml`, `navigation.yaml` (Home, Archive, About, Search),
  `images.yaml`, `code-blocks.yaml`, `social-media-links.yaml`
- `config/cms.yaml`: the editing schema for Nera Pro (labels, help texts and
  field types per page type, including a post's `series`, `series_part`,
  `facts` and `location`); Nera ignores it
- `theme/views/partials/`: the theme's seams, filled with the plugins' output
  (`head-extra` carries the canonical links and the structured data,
  `scripts-extra` loads `/js/search.js` on the search page only)
- `theme/views/pages/search.pug` and `theme/views/vendor/`: the search page
  and the plugins' published templates
- `theme/assets/js/search.js` (plugin-search's script) and
  `theme/assets/images/workbench.jpg`
- plugins: tags, page-pagination, feed, sitemap, search, structured-data,
  canonical-links, code-blocks, navigation, images, social-media-links

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
        Latest post: Neuester Beitrag
        Series: Serie
        Part: Teil
        About the author: Über den Autor
        posts: Beiträge
        Imprint: Impressum
        Privacy: Datenschutz
        Pagination: Blätternavigation
        Read more: Weiterlesen
        search_label: Suche
        search_placeholder: Suchen …
        search_no_results: Keine Treffer
```

The menu entries in `config/navigation.yaml` are plain text: `Start`,
`Archiv`, `Über mich`, `Suche`.

Set the social links' label in `config/social-media-links.yaml`:

```yaml
aria_label: Soziale Medien
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
   site's real address. The feed, the sitemap, the canonical links and the
   structured data are built from it.
2. Replace `pages/imprint.md` and `pages/privacy.md` with your own legal texts.
3. Put your name and a sentence about yourself under `author:` in
   `config/theme.yaml`, the same name under `entity:` in
   `config/structured-data.yaml`, and replace the social link in
   `config/social-media-links.yaml`, the about page and the sample posts.
4. Add `theme/assets/search-index*.json` to `.gitignore`: plugin-search
   writes the index there on every build.
5. When you delete the sample posts, set `blog.featured_series` and
   `blog.highlight_tag` in `config/theme.yaml` to a series and a tag of your
   own, or to `''` to leave those blocks out. A new post is a Markdown file
   in `pages/posts/` with `date` and `is_post: true`.
