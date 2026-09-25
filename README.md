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

That is all: after you push the file, GitHub Pages automatically formats the post, adds a link back to all posts and the site footer, and places it in the posts list. You do not need to edit HTML or update the posts page.

To keep a work in progress off the published site, put it in `_drafts/` instead. Move it to `_posts/` and add the date to its filename when it is ready.

## Previewing

GitHub Pages builds the site automatically after a push. To preview the same build locally, install Ruby, then run:

```sh
bundle install
./bin/serve
```

Then open <http://localhost:8000>. The preview binds to `0.0.0.0`, so it also
works in a container or remote development environment. Set `PORT` or
`JEKYLL_HOST` to override either default:

```sh
PORT=4000 JEKYLL_HOST=127.0.0.1 ./bin/serve
```

Do not serve the repository root with a plain static server such as
`python -m http.server`. The source files contain Jekyll front matter and
Liquid expressions. A plain server sends those instructions to the browser
without rendering them, which makes text such as `layout: default` and Liquid
loop instructions appear on the page.
