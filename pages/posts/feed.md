---
layout: pages/post.pug
slug: feed
title: Your feed and sitemap
description: The build writes an Atom feed for feed readers and a sitemap for search engines.
date: 2025-03-02
tags: [publishing, nera]
---

## The feed

Every build writes `feed.xml`, an Atom feed of your newest posts with their
full text. Feed readers find it through a link in every page's head, so
readers can follow the blog without an account anywhere.

## The sitemap

The build also writes `sitemap.xml`, listing every page, and a `robots.txt`
that points search engines to it.

## The one setting both need

A feed and a sitemap need absolute addresses, so both are built from
`origin` in `config/app.yaml`. Set it to your site's real address before
you deploy; while it says `https://example.com`, every link in the feed
points there.
