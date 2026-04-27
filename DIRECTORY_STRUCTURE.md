# Directory Structure

This blog uses a clean, organized directory structure for easy management of content and assets.

## 📁 Project Structure

```
research-blog/
├── index.html              # Blog homepage
├── post.html               # Individual post view
├── about.html              # About page
├── admin.html              # Admin panel for managing posts
│
├── styles.css              # Main styling
├── admin-styles.css        # Admin panel styling
│
├── script.js               # Main blog functionality
├── admin-script.js         # Admin panel functionality
│
├── data/
│   └── posts.json          # Post metadata (title, date, category, filename)
│
├── posts/                  # Post content files (markdown)
│   ├── getting-started.md
│   ├── literature-review-insights.md
│   ├── methodology-deep-dive.md
│   └── (add your posts here)
│
├── images/                 # Blog images
│   └── (your image files here)
│
├── README.md               # Main documentation
└── DIRECTORY_STRUCTURE.md  # This file
```

## 📝 How Data is Stored

### Post Metadata (data/posts.json)
Stores basic information about each post:

```json
[
  {
    "id": "getting-started",
    "title": "Getting Started with My Research",
    "date": "2026-04-25",
    "category": "General",
    "excerpt": "Welcome to my research blog...",
    "filename": "getting-started.md"
  }
]
```

### Post Content (posts/*.md)
The actual content is stored as individual Markdown files:

```markdown
# Post Title

Your content here. Just write naturally!

Leave a blank line between paragraphs - Markdown handles the formatting.

## Sections

- Use headings (# ## ###)
- Create bullet lists
- Add **bold** and *italic* text
- Include ![images](./images/file.jpg)
```

### Images (images/)
All blog images go in this folder:

```
images/
├── research-photo.jpg
├── chart.png
└── diagram.svg
```

In your post, reference images like:
```markdown
![My research](./images/research-photo.jpg)
```

## 🔄 Workflow

### Creating a Post

1. **Admin Panel** → Click "⚙️ Admin" from blog
2. **New Post** → Click "+ New Post"
3. **Fill Info**:
   - Title: "My Research Title"
   - Date: 2026-04-27
   - Category: "Research"
   - Excerpt: "Short summary..."
   - Content: Write in Markdown
4. **Save** → Click "Save Post"
5. **Download** → Markdown file downloads automatically
6. **Add to Repo** → Copy file to `posts/` folder
7. **Commit** → `git add posts/my-research-title.md`
8. **Push** → `git push` to GitHub

### Editing a Post

1. Admin → Edit button
2. Modify content
3. Save (downloads updated markdown file)
4. Replace file in `posts/` folder
5. Commit and push

### Deleting a Post

1. Admin → Delete button
2. Delete `.md` file from `posts/` folder
3. Commit and push

## 📂 File Organization

### Keep It Clean

- **One post = One .md file** (no extra files)
- **Image names are descriptive** (my-research-photo.jpg not img1.jpg)
- **Consistent naming** (use hyphens, lowercase: my-post.md)
- **Regular backups** (export metadata regularly)

### Do NOT Include

- `.json` files (except data/posts.json)
- `.html` versions of posts
- Duplicate files
- Old/backup posts (use git history instead)

## 💾 Data Persistence

### Stored Locally
- Browser's localStorage holds admin changes temporarily
- Metadata can be exported as JSON backup

### Stored in Repository
- `data/posts.json` - Post metadata
- `posts/*.md` - All post content
- `images/` - All images
- Everything tracked by Git

### Syncing Your Content

Posts are only visible after:
1. ✅ Adding to `posts/` folder
2. ✅ Committing to Git
3. ✅ Pushing to GitHub
4. ✅ Waiting for GitHub Pages to rebuild (usually < 1 min)

## 🎯 Best Practices

### Post Filenames
- Derive from title automatically
- Use lowercase and hyphens
- Examples:
  - `getting-started.md`
  - `literature-review.md`
  - `my-research-findings.md`

### Image Organization
- Organize by topic if many images:
  ```
  images/
  ├── research/
  │   ├── photo1.jpg
  │   └── photo2.jpg
  └── general/
      └── logo.png
  ```

### Post Structure (Markdown)
```markdown
# Main Title

Opening paragraph with context...

## First Section

Content with **emphasis** and *style*.

- Bullet one
- Bullet two

## Another Section

More content here.

### Subsection

Details and examples.

## Conclusion

Summary and next steps.
```

### Backup Strategy
1. Click "Export Posts" in Admin monthly
2. Save the JSON file
3. Store safely (cloud, external drive, email to yourself)
4. If disaster strikes, use "Import Posts" to restore

## 🌐 Deploying to GitHub Pages

All files are static. Just push everything to `username.github.io` repository:

```bash
git add .
git commit -m "Add new blog post"
git push
```

Site updates automatically within 1 minute.

## ⚠️ Important Notes

- **Markdown is mandatory** for post content (auto-formatting)
- **Metadata and content separated** (JSON + .md files)
- **Images should be reasonable size** (blog is deployed on GitHub)
- **No database needed** - everything is files and Git
- **Works offline** - write posts without internet
- **Version controlled** - full history in Git

## 🚀 Getting Started

1. **Edit about.html** with your information
2. **Create first post** via Admin panel
3. **Add markdown file** to `posts/` folder
4. **Add images** to `images/` folder (if needed)
5. **Commit and push** to GitHub
6. **Blog goes live** at https://username.github.io

Happy blogging! 📚✍️

