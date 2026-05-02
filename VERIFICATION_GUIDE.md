# How to Verify Your Blog Site

## 🧪 Test Locally (Before Uploading to GitHub)

### Option 1: Using Python (Easiest)

**Python 3:**
```bash
cd /home/apollo/Workspace/webpage
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

Then open: **http://localhost:8000**

### Option 2: Using Node.js

```bash
npm install -g http-server
cd /home/apollo/Workspace/webpage
http-server
```

Then open the URL shown (usually **http://localhost:8080**)

### Option 3: Using VS Code

1. Install "Live Server" extension
2. Right-click `index.html`
3. Click "Open with Live Server"
4. Browser opens automatically

### Option 4: Using PHP

```bash
cd /home/apollo/Workspace/webpage
php -S localhost:8000
```

Then open: **http://localhost:8000**

---

## ✅ What to Check

### 1. **Homepage (index.html)**
- [ ] Blog title and tagline display correctly
- [ ] Navigation links work (Blog, About, Admin)
- [ ] Example posts appear in the list
- [ ] Post cards are readable on mobile
- [ ] "Read More" buttons work
- [ ] Admin link (⚙️) is visible and clickable

### 2. **Individual Post (post.html)**
- [ ] Click "Read More" on a post
- [ ] Full post content displays with markdown formatting
- [ ] Headings, paragraphs, lists are properly formatted
- [ ] Post metadata (date, category) shows
- [ ] "Back to all posts" link works
- [ ] Images display (if any)

### 3. **About Page (about.html)**
- [ ] About page loads correctly
- [ ] Content is readable
- [ ] Navigation works

### 4. **Admin Panel (admin.html)**
- [ ] Click "⚙️ Admin" button
- [ ] See list of existing posts
- [ ] "New Post" button opens editor
- [ ] Can type in the form fields
- [ ] Markdown toolbar buttons appear
- [ ] Preview button works
- [ ] Cancel button closes editor

### 5. **Responsive Design**
Test on different screen sizes:

```
Desktop:   Resize browser to 1200px+
Tablet:    Resize to 768px
Mobile:    Resize to 375px
```

Or use Chrome DevTools (F12 → Toggle device toolbar):
- [ ] All text readable
- [ ] Navigation stacks properly
- [ ] Buttons are clickable
- [ ] No horizontal scroll
- [ ] Images scale properly

### 6. **Create a Test Post**
1. Go to Admin panel
2. Click "+ New Post"
3. Fill in:
   - Title: "Test Post"
   - Date: Today's date
   - Category: "Test"
   - Excerpt: "This is a test"
   - Content: 
     ```
     # Test Heading
     
     This is a test paragraph.
     
     ## Sub heading
     
     - Bullet 1
     - Bullet 2
     ```
4. Click "Preview" → Check formatting
5. Click "Save Post" → Should download a `.md` file
6. **Important**: Add this file to `posts/` folder
7. Refresh the blog → New post should appear

### 7. **Test Post Display**
- [ ] New post appears in blog listing
- [ ] Excerpt shows correctly
- [ ] Date and category are visible
- [ ] Click to open full post
- [ ] Markdown formatting looks good
- [ ] Headings, lists, text are properly styled

---

## 🔍 Browser Console Errors

Press **F12** to open Developer Tools:

1. Click "Console" tab
2. Check for **red error messages**
3. Common issues:
   - ❌ `404 posts/filename.md` → File not in `posts/` folder
   - ❌ `Cannot read property` → Missing file or script error
   - ✅ No red errors → Good!

---

## 📱 Test on Mobile

### Using Your Phone:
1. Connect to same WiFi as your computer
2. Find your computer's IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
3. On phone, go to: `http://YOUR_IP:8000`

### Using Chrome Emulator:
1. Open DevTools (F12)
2. Click device icon (top-left)
3. Choose device (iPhone, Samsung, etc.)
4. Test all features

---

## 🚀 Checklist Before Deploying

- [ ] Homepage loads without errors
- [ ] All posts display correctly
- [ ] About page works
- [ ] Admin panel opens and works
- [ ] Can create a test post
- [ ] Test post downloads as markdown file
- [ ] Test post added to `posts/` folder
- [ ] Site responsive on mobile (375px)
- [ ] No red errors in console (F12)
- [ ] All navigation links work
- [ ] Images display (if any)
- [ ] Markdown formatting looks good

---

## 📋 File Checklist

Make sure you have these files:

```
✅ index.html
✅ post.html
✅ about.html
✅ admin.html
✅ styles.css
✅ admin-styles.css
✅ script.js
✅ admin-script.js
✅ data/posts.json
✅ posts/getting-started.md
✅ posts/literature-review-insights.md
✅ posts/methodology-deep-dive.md
✅ images/ (folder)
✅ README.md
✅ DIRECTORY_STRUCTURE.md
```

---

## 🐛 Common Issues & Fixes

### Issue: Posts don't show up
**Fix:**
- Check `data/posts.json` exists
- Check `posts/` folder has `.md` files
- Verify filenames match in `posts.json`
- Look for red errors in console (F12)

### Issue: Admin panel shows "Loading..." forever
**Fix:**
- Check that `data/posts.json` is valid JSON
- Open console (F12) → Look for errors
- Refresh the page

### Issue: Images don't show
**Fix:**
- Check image files are in `images/` folder
- Use correct path: `./images/filename.jpg`
- Check filename spelling (case-sensitive)

### Issue: Markdown not formatting
**Fix:**
- Verify `marked.js` library loaded (check console)
- Make sure markdown syntax is correct
- Check post content in `.md` file

### Issue: "Post not found"
**Fix:**
- Verify post ID in URL matches `data/posts.json`
- Check markdown file exists in `posts/` folder
- Refresh the page

---

## ✨ After Verification

Once everything works locally:

1. **Commit to Git**
   ```bash
   git add .
   git commit -m "Initial blog setup - verified locally"
   git push
   ```

2. **Wait 1-2 minutes** for GitHub Pages to build

3. **Visit** `https://username.github.io`

4. **Test again** on the live site

---

## 🎯 Quick Test Steps

Just want a quick check? Do this:

1. Start local server: `python -m http.server 8000`
2. Open: `http://localhost:8000`
3. Check:
   - [ ] Blog homepage loads
   - [ ] Posts visible
   - [ ] Click a post → opens full post
   - [ ] Admin panel works
   - [ ] No red console errors (F12)
4. ✅ If all pass → Ready to deploy!

---

**Need help?** Run the test server and check the console for specific errors! 🚀
