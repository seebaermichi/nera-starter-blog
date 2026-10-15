---
layout: pages/post.pug
slug: write-a-post
title: Write your first post
description: A post is one Markdown file in pages/posts/ with a few lines of frontmatter.
date: 2026-09-21
tags: [writing, nera]
---

## One file per post

Every post is a Markdown file in `pages/posts/`. The file name becomes the
address: `hello.md` is published as `/posts/hello.html`. Copy this one to
start:

```markdown:pages/posts/hello.md
---
layout: pages/post.pug
title: Hello
description: The first post on my blog.
date: 2026-10-01
tags: [news]
---

## A heading

Start the text at `##`: the title above is the page's only first-level
heading.
```

## The frontmatter

- `layout: pages/post.pug` makes the page a post: it is listed on the home
  page, in the archive and in the feed.
- `date` orders the posts. Always set it; a file's own date changes whenever
  the file is copied.
- `description` is the excerpt on the home page and the summary in the feed.
- `tags`, `author`, `updated`, `image` and `image_alt` are optional.

## Preview and build

Run `nera dev` to see the post while you write, and `nera build --check` to
build the blog into `public/` and check every page.
