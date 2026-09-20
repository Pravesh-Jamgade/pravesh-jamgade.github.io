# Pravesh Jamgade's Website

An intentionally simple personal website powered by Jekyll, the static-site generator built into GitHub Pages. Shared layouts format every page and post consistently, and the posts page is generated automatically.

## Writing a post

Create a plain-text Markdown file in `_posts/`. Its name must follow `YYYY-MM-DD-short-title.md`. Start with this small header, then write normally beneath it:

```text
---
layout: post
title: "The title readers will see"
---

Write the post here. Leave a blank line between paragraphs.

## A section heading

More text here. Markdown links, lists, and emphasis also work when you need them.
```

That is all: after you push the file, GitHub Pages automatically formats the post, adds the site header and footer, and places it in the posts list. You do not need to edit HTML or update the posts page.

To keep a work in progress off the published site, put it in `_drafts/` instead. Move it to `_posts/` and add the date to its filename when it is ready.

## Previewing

GitHub Pages builds the site automatically after a push. To preview the same build locally, install Ruby, then run:

```sh
bundle install
bundle exec jekyll serve --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000` after Jekyll reports that the server is ready. Do
not preview the source directory with a plain static-file server: Jekyll must
first process the front matter, layouts, and Liquid tags such as
`{% for post in site.posts %}`.
