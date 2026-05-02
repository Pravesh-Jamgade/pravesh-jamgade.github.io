# GitHub Pages Troubleshooting Guide

## 🔍 Quick Checks

### 1. **Check Repository Name**
- Go to GitHub → Your repository
- URL should be: `github.com/username/username.github.io`
- ⚠️ If different → Rename it to `username.github.io`

### 2. **Check GitHub Pages is Enabled**
1. Go to repository → **Settings**
2. Scroll down to **"Pages"** section
3. Check:
   - ✅ Source is set to **"Deploy from a branch"**
   - ✅ Branch is **"main"** (or "master")
   - ✅ Folder is **"/ (root)"**
4. Look for green checkmark: "Your site is live at `https://username.github.io`"

### 3. **Check Files are Pushed**
```bash
git status
```
Should show: "On branch main" and "nothing to commit"

If files show as untracked, push them:
```bash
git add .
git commit -m "Deploy blog"
git push origin main
```

### 4. **Wait for Build to Complete**
1. Go to repository → **Actions** tab
2. Look for recent workflow run
3. Should show ✅ green checkmark
4. Wait 1-2 minutes if still running

### 5. **Clear Browser Cache**
Press: **Ctrl+Shift+Delete** (Windows/Linux) or **Cmd+Shift+Delete** (Mac)
- Clear cache
- Reload site: `https://username.github.io`

---

## 🐛 Common Issues & Fixes

### Issue: 404 Not Found

**Cause:** Files not in repository root

**Fix:**
```bash
# Make sure index.html is in root, not in a subfolder
ls -la index.html

# If in subfolder, move it:
mv subfolder/* .
git add .
git commit -m "Move files to root"
git push
```

### Issue: Blank Page (nothing shows)

**Cause:** JavaScript errors or missing files

**Fix:**
1. Open site
2. Press **F12** (Developer Tools)
3. Click **Console** tab
4. Look for red error messages
5. Common errors:
   - `404 posts/filename.md` → Files missing
   - `marked is not defined` → Library not loading
   - `Cannot fetch` → File path wrong

### Issue: Wants to download index.html

**Cause:** Server is treating it as download

**Fix:**
1. Go to **Settings** → **Pages**
2. Change source to "Deploy from a branch"
3. Select **main** branch and **/ (root)** folder
4. Save and wait 2-3 minutes

### Issue: Redirects to different URL

**Cause:** CNAME file or custom domain issues

**Fix:**
1. Go to Settings → Pages
2. Remove custom domain if you don't have one
3. Check if **CNAME** file exists - delete if not needed
4. Push changes and wait

---

## ✅ Verification Checklist

```bash
# 1. Check files are committed
git log --oneline -5

# 2. Check remote is set
git remote -v

# 3. Check current branch
git branch

# 4. Check files in root
ls -la | grep -E "index|admin|post|about"
```

All should show your blog files.

---

## 🚀 Manual Fix Steps

If nothing above works:

```bash
# 1. Check git status
git status

# 2. Add all files
git add .

# 3. Commit
git commit -m "Fix: Redeploy blog"

# 4. Push
git push origin main

# 5. Wait 2 minutes
# Then visit: https://username.github.io

# 6. If still not working, force refresh
# Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

---

## 📊 Check Deployment Status

Visit: `https://github.com/username/username.github.io/actions`

Look for recent deployment:
- 🟢 Green checkmark = Success
- 🟡 Yellow circle = Still running
- 🔴 Red X = Failed (click for error details)

---

## 🔗 Test URLs

- Main site: `https://username.github.io`
- Blog: `https://username.github.io/index.html`
- Post: `https://username.github.io/post.html?id=getting-started`
- Admin: `https://username.github.io/admin.html`
- About: `https://username.github.io/about.html`

Try each one and check for errors.

---

## 📝 Still Not Working?

Provide these details:

1. What's your GitHub username?
2. What error do you see? (404, blank page, etc.)
3. What does the browser console show? (F12 → Console)
4. What's the site URL you're trying to visit?

Then we can debug specifically!
