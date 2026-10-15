# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
