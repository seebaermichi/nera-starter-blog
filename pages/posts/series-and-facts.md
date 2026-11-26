---
layout: pages/post.pug
slug: series-and-facts
title: Series, facts and the home page
description: Join posts into a series, give a post its figures, and choose what the home page shows.
date: 2026-10-12
tags: [writing, nera]
series: Start here
series_part: 2
facts:
    - label: Frontmatter keys
      value: 3 keys
    - label: Theme settings
      value: 2 keys
    - label: Facts per post
      value: at most 4 figures
    - label: Time to set up
      value: 5 minutes
is_post: true
---

## A series

Give each post of a series the same `series` and its place in `series_part`:

```yaml
series: Start here
series_part: 2
```

Above the title the post then says which series and part it is, and under
the post the parts of the series are listed in order, the current one
marked. This post is part two; [Write your first post](/posts/write-a-post.html)
is part one.

## Facts

`facts` is a list of at most four figures, each a `label` and a `value`. They
stand beside the text, or above it on a phone. Give a value its unit:
`5 minutes`, not `5`.

```yaml
facts:
    - label: Time to set up
      value: 5 minutes
```

## The home page

Two keys in `config/theme.yaml` choose what the home page shows below the
newest posts. `blog.featured_series` names the series it features, with a
link to part one; `blog.highlight_tag` names a tag whose newest four posts it
lists. Leave either empty, and its block disappears.

```yaml
blog:
    featured_series: Start here
    highlight_tag: writing
```

The about block below them comes from `author` in the same file: a name, a
sentence about you and the address of your about page.
