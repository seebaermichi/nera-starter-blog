# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-11-26

### Added

-   Search: `pages/search.md` on the site's own page type `theme/views/pages/search.pug` (the theme's page header, then plugin-search's published template), a "Search" item as the last menu entry, `config/search.yaml` (one index per language, no title of its own, no script tag in the template), `theme/assets/js/search.js` (plugin-search 2.4.0's script) loaded by the `scripts-extra` seam on the search page only, and the texts `search_label`, `search_placeholder` and `search_no_results` under `translations.en`; the README's German block carries them too.
-   Structured data: `config/structured-data.yaml` with the site entity as a `Person` named like `author.name` and `articles.key: is_post`, and `is_post: true` on the four sample posts, so every post gets a `BlogPosting` whatever the site's language.
-   Canonical links: an absolute canonical link to itself on every page, tag pages included, from `origin` in `config/app.yaml`.
-   `theme/views/partials/head-extra.pug` with the canonical links and the structured data, and the published templates of plugin-canonical-links, plugin-structured-data and plugin-search in `theme/views/vendor/`, unedited.
-   `config/plugin-order.yaml`: plugin-canonical-links, plugin-structured-data and plugin-search run last, so the tag pages get a canonical link and structured data and are in the search index.
-   `config/cms.yaml`: the search page type and a post's `is_post`.
-   Dependencies merged into the site: `@nera-static/plugin-search` ^2.4.0, `@nera-static/plugin-structured-data` ^1.1.2 and `@nera-static/plugin-canonical-links` ^2.2.4.
-   README: search, structured data and canonical links; the First steps name `origin` for the canonical links and the structured data too, the author's name under `entity:` in `config/structured-data.yaml`, git-ignoring `theme/assets/search-index*.json`, and `is_post: true` for a new post; the German menu entries.

### Changed

-   `@nera-static/theme-blog` ^2.1.0, the release with the search page's styling.
-   The npm and `nera.starter` descriptions, which the `nera new` picker shows, name search, structured data and canonical links and say the only JavaScript runs on the search page, instead of "No JavaScript".

## [1.3.0] - 2026-11-25

### Added

-   `pages/posts/series-and-facts.md`, a fourth sample post: part 2 of the series "Start here" (part 1 is `write-a-post.md`, which now sets `series` and `series_part`), with four `facts`.
-   `config/theme.yaml`: `blog.featured_series: Start here` and `blog.highlight_tag: writing` for the home's series and highlight blocks, and `author.name`, `author.bio`, `author.href` (`/about.html`) for the about block and the byline of every post without its own `author`.
-   `config/app.yaml`: the theme's new texts `Latest post`, `Series`, `Part`, `About the author` and `posts` under `translations.en`; the README's German block carries them too.
-   `config/cms.yaml`: a post's `series`, `series_part` (number), `facts` (a list of `label` and `value`) and `location`, which Plain does not show but the photo and travel blog themes do, so it is kept when a site switches by `theme:`.
-   README: the look "Plain", the four sample posts, the new `config/theme.yaml` keys, and a First steps line for `author:` and for `featured_series`/`highlight_tag` once the sample posts are gone.

### Changed

-   Dependencies raised to `@nera-static/theme-blog` ^2.0.0 (the look "Plain" and the contract it shares with Stack, Ansitz and Umwege), `@nera-static/plugin-tags` ^3.4.1 and `@nera-static/plugin-images` ^1.0.3, the theme's peer floors. Sites already scaffolded keep theme-blog 1.x; a starter has no update path.
-   The npm and `nera.starter` descriptions, which the `nera new` picker shows, name four sample posts with a series.
-   The home's first body heading is "About this blog" instead of "Start here", so it no longer repeats the series block's heading above it.
-   README: the German texts for `--lang de` also set `aria_label: Soziale Medien` in `config/social-media-links.yaml`.

## [1.2.0] - 2026-11-22

### Added

-   `config/cms.yaml`, the editing schema Nera Pro reads (format v1): one entry per page type, keyed by its layout (`pages/post.pug`, `pages/home.pug`, `pages/archive.pug`, `pages/default.pug`), with a label, `folder: posts` for posts, and per field a label, a help text where useful and a `type` where the value alone would mislead (dates, tags). Nera ignores the file; a scaffolded site builds the same `public/` with or without it.

## [1.1.0] - 2026-10-16

### Changed

-   `engines.node` is `>=22.12.0`, documenting the real floor: on Node 20 the bundled npm 10.8 crashes while installing a fresh blog site (`vite` 8's optional peers), and npm 10.9 ships with Node 22.12.
-   README: "First steps", which `nera new --starter blog` prints, no longer ends with "Run `nera dev`"; the CLI's own next steps already say `npm run dev`.

## [1.0.1] - 2026-10-15

### Changed

-   Dependencies raised to `@nera-static/theme-blog` ^1.0.3, `@nera-static/plugin-tags` ^3.4.0 and `@nera-static/plugin-sitemap` ^1.1.0. A `--lang de` site no longer shows a language switch with one item, the sitemap's `<lastmod>` reads a post's `updated`, and tag pages show calendar dates that do not depend on the build machine's time zone.
-   `theme/views/vendor/plugin-tags/pages/tag-overview.pug` is the template `@nera-static/plugin-tags` 3.4.0 publishes.
-   The README's German texts replace only the copied `de:` entry; deleting `en:` is no longer needed.

## [1.0.0] - 2026-10-15

### Added

-   First release: the `blog` starter for `nera new --starter blog`. Requires `@nera-static/nera` 1.11.0 or later. A blog on `@nera-static/theme-blog` with no JavaScript and no third-party requests; a scaffolded site passes `nera build --check` and `nera validate` with no findings, also with every check rule promoted to error.
-   Dependencies merged into the site: `@nera-static/theme-blog` ^1.0.2 and the plugins `plugin-tags` ^3.3.0, `plugin-page-pagination` ^2.4.0, `plugin-feed` ^1.0.2, `plugin-sitemap` ^1.0.1, `plugin-code-blocks` ^1.2.1, `plugin-navigation` ^3.1.1, `plugin-images` ^1.0.2 and `plugin-social-media-links` ^2.3.0.
-   `config/app.yaml`: `lang`, `name`, `robots`, `theme: blog`, `origin: https://example.com` with a comment to replace it before deploying (the feed and the sitemap need it), and `translations.en` with `app_description`, `app_keywords`, `language_name` and every theme, footer-link and plugin text, so `--lang` copies them into a new entry to translate.
-   `config/theme.yaml` (`extra_css` for the code-blocks stylesheet, `footer_links` to the imprint and privacy pages), `tags.yaml` (the theme's tag page, a description for every tag page), `navigation.yaml` (Home, Archive, About), `images.yaml` (eager post image, no unused `og:image` crop), `code-blocks.yaml` (no copy button, the site ships no JavaScript) and `social-media-links.yaml` (no `target="_blank"`, one placeholder link).
-   `theme/views/partials/`: the theme's seams filled with the plugins' output: `feed-link`, `nav-main`, `footer-extra`, `post-media`, `card-media`, `post-tags`, `post-pagination`, `tag-overview` and `tag-cloud`.
-   `theme/views/vendor/`: the published templates of plugin-feed, plugin-images, plugin-navigation, plugin-page-pagination, plugin-social-media-links (without `fontawesome-cdn-link.pug`, which loads a CDN) and plugin-tags, unchanged.
-   `pages/index.md` (home, naming what to edit first: `origin`, the name, the legal pages, the sample posts), `archive.md` and `about.md`.
-   `pages/imprint.md` and `pages/privacy.md`: clearly marked placeholders citing § 5 DDG and § 25 TDDDG, to be replaced by the site owner's own legal texts.
-   `pages/posts/`: three sample posts across 2025 and 2026 on writing a post (with a named code block), tags and images (with `author`, `updated` and a frontmatter image), and the feed and sitemap; `theme/assets/images/workbench.jpg` for the image post.
