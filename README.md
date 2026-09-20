# Pravesh Jamgade's Home Page

An intentionally simple personal website inspired by early personal pages from the 1980s and 1990s.

The site uses a separate static HTML file for each navigation tab and each post. Shared styles live in [`styles.css`](styles.css). There is no JavaScript, build step, database, framework, image, or external dependency.

## Editing

Edit the relevant HTML page directly. The main pages live in the repository root, while individual articles live in [`posts/`](posts/). Update `styles.css` for site-wide visual changes.

## Previewing

Open `index.html` in a web browser, or serve the repository with any basic static HTTP server:

```sh
python3 -m http.server 8000
```
