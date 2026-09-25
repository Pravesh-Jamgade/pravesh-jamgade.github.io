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

## Adding a photo

Add another entry to `_data/photos.yml` with the image URL, accessible description, and one-line caption:

```yaml
- src: /assets/images/example.jpg
  alt: A description of the photo
  caption: A short caption for the photo.
```

The gallery automatically places each new photo into the next available slot, with three photos per row. Additional rows continue down the page and are available through normal page scrolling.

## Previewing

GitHub Pages builds the site automatically after a push. To preview the same build locally, install Ruby, then run:

```sh
bundle install
bundle exec jekyll serve
```
