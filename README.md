# Research Blog

A simple, clean blogging site for PhD researchers. Designed to be easy to maintain and deploy on GitHub Pages.

## Features

- 📱 Fully responsive design (works on mobile, tablet, and desktop)
- ✍️ Easy post management - write in simple Markdown text
- 🎨 Clean, academic-focused design
- 🚀 No backend required - static site
- 📝 Posts stored as simple text files (.md)
- 🏷️ Category tags for organizing posts
- 📄 Auto-formatting for paragraphs and line breaks

## How It Works

Posts are stored in two places:

1. **`data/posts.json`** - Contains post metadata (title, date, category, excerpt, filename)
2. **`posts/`** - Contains the actual post content as `.md` (markdown) files

This makes it super easy to:
- Edit posts in any text editor
- Auto-format content (just use markdown)
- Organize posts by individual files
- Backup and manage posts easily

## Quick Start

### Create a New Post

1. Click **"⚙️ Admin"** link from the blog homepage
2. Click **"+ New Post"**
3. Fill in:
   - **Title** - Post name
   - **Date** - When it was written
   - **Category** - Topic (e.g., "Research", "Methods")
   - **Excerpt** - Short summary for blog listing
   - **Content** - Write in Markdown (see formatting below)
4. Click **"Save Post"**
5. A markdown file will download
6. Add this file to the `posts/` folder in your repository
7. Commit and push to GitHub

### Edit a Post

1. Go to **Admin**
2. Click **"Edit"** on the post
3. Make your changes
4. Save and update the markdown file in `posts/`

### Delete a Post

1. Go to **Admin**
2. Click **"Delete"**
3. Remove the `.md` file from `posts/` folder

## Markdown Formatting

Write your posts in Markdown - it auto-formats everything!

```markdown
# Main Heading (# at the start)

## Sub Heading (## at the start)

### Smaller Heading (### at the start)

**bold text** (wrap in **)
*italic text* (wrap in *)

- Bullet point
- Another point
  - Nested point

1. Numbered item
2. Another item

[Link text](https://example.com)

![Image alt text](./images/filename.jpg)

> Quote or important note
```

**Paragraphs**: Just leave a blank line between paragraphs - Markdown handles it automatically!

## Directory Structure

```
your-blog/
├── index.html              # Blog homepage
├── post.html               # Individual post view
├── about.html              # About page
├── admin.html              # Admin panel
│
├── data/
│   └── posts.json          # Post metadata
│
├── posts/
│   ├── getting-started.md
│   ├── my-research.md
│   └── (your post files)
│
├── images/
│   ├── my-image.jpg
│   └── (your image files)
│
└── styles.css, script.js, etc.
```

## Adding Images

1. Upload images to the `images/` folder
2. In your post, reference them:
   ```markdown
   ![Image description](./images/my-image.jpg)
   ```

## Customization

### Update Your Information

Edit `about.html` to add:
- Your name and bio
- Research interests
- Contact information
- Social media links

### Change Site Title

Edit `index.html` and update:
```html
<h1>Your Blog Title</h1>
<p class="tagline">Your tagline here</p>
```

### Styling

Edit `styles.css` to customize:
- Colors
- Fonts
- Spacing
- Layout

## Deploying to GitHub Pages

### Simple Setup

1. Create a GitHub repository named `username.github.io`
2. Clone it locally or upload files through GitHub's web interface
3. Push all files to the repository
4. Your blog goes live at `https://username.github.io` in a few minutes

### Using Git

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial blog setup"

# Add your repository
git remote add origin https://github.com/username/username.github.io.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Custom Domain

1. In GitHub repository settings, find "GitHub Pages"
2. Add your custom domain
3. Update your domain's DNS settings to point to GitHub Pages
4. See [GitHub's documentation](https://docs.github.com/en/pages) for details

## Admin Panel Features

- ✏️ **Create & Edit Posts** - Full markdown editor with formatting toolbar
- 🗑️ **Delete Posts** - Remove posts you no longer need
- 📥 **Import Posts** - Restore posts from backup JSON
- 📤 **Export Posts** - Backup all post metadata
- 👁️ **Preview** - See how your post looks before saving
- 💾 **Auto-Download** - Markdown files auto-download when you save

## Data Persistence

- Post metadata is stored in `data/posts.json`
- Post content is stored as `.md` files in `posts/`
- Images are stored in `images/`
- Everything is version-controlled via Git

## Troubleshooting

### Posts not showing up
- Check that `data/posts.json` has valid JSON syntax
- Verify `.md` files are in the `posts/` folder
- Clear browser cache and reload

### Images not displaying
- Make sure image files are in the `images/` folder
- Use correct path: `./images/filename.jpg`
- Check that image filenames match (case-sensitive on Linux)

### Admin panel not working
- Ensure `admin.html`, `admin-styles.css`, and `admin-script.js` are in the root folder
- Check browser console (F12) for errors
- Reload the page

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Tips

1. **Save Regularly** - Use "Export Posts" to backup your metadata
2. **Use Clear Titles** - They become your markdown filenames
3. **Write in Markdown** - It's simple and auto-formats beautifully
4. **Organize by Category** - Makes it easier to find posts
5. **Include Dates** - Helps readers understand content timeline
6. **Test Links** - Check external links in preview
7. **Commit Often** - Use meaningful commit messages

## Getting Help

- Check the admin panel "❓ Help" button for quick tips
- Review [Markdown guide](https://www.markdownguide.org/)
- See [GitHub Pages docs](https://pages.github.com)
- Check [Marked.js](https://marked.js.org/) for advanced markdown features

## Example Post Structure

Your `.md` files should look like this:

```markdown
# My Post Title

This is the first paragraph. Markdown will automatically
format this nicely with proper spacing.

Here's a new paragraph. Just leave a blank line between
paragraphs and Markdown handles the rest!

## Section Heading

- Point one
- Point two
- Point three

With images:
![My image](./images/example.jpg)

And links:
[Visit my university](https://example.edu)
```

---

**Happy blogging!** 📚✍️

For the latest updates, visit the [repository](https://github.com).

