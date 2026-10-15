---
layout: pages/post.pug
slug: tags
title: Tags and tag pages
description: Every tag you give a post gets a page that lists all its posts.
date: 2025-11-04
updated: 2026-01-12
author: Ada Example
tags: [writing, tags]
image: /images/workbench.jpg
image_alt: Shapes in rust, grey and sand on a light background
---

## Tagging a post

List a post's tags in its frontmatter:

```yaml
tags: [writing, tags]
```

The tags appear under the post, each linking its tag page at
`/tags/<tag>.html`. The home page and the archive show every tag of the blog.

## Images

This post also has an image: `image: /images/workbench.jpg` in the
frontmatter, its text alternative in `image_alt`. The file lives in
`theme/assets/images/`, and the build turns it into a responsive picture in
modern formats. Images in the text work the same way:
`![What the image shows](/images/workbench.jpg)`. Always describe what the
image shows.
