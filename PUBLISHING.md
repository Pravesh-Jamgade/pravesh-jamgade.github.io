# Publishing this blog with GitHub Pages

This site is deliberately static: GitHub Pages can publish the HTML, CSS, JavaScript, Markdown, and images directly. No build command or paid server is required.

## First-time setup

1. Create a GitHub repository. Name it `<username>.github.io` to publish at `https://<username>.github.io/`, or use any repository name to publish under `https://<username>.github.io/<repository>/`.
2. Add this site's files to the repository and push them to the `main` branch.
3. On GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch** as the source.
5. Select the `main` branch, choose the `/ (root)` folder, and click **Save**.
6. Wait for the Pages deployment to finish. GitHub shows the public URL at the top of the Pages settings screen. The first deployment can take a few minutes.

### Push the site from a terminal

```bash
git init
git add .
git commit -m "Publish blog"
git branch -M main
git remote add origin https://github.com/<username>/<username>.github.io.git
git push -u origin main
```

Replace both instances of `<username>` before running the commands. If the repository already exists locally, only `git add`, `git commit`, and `git push` are needed.

## Publish a new post

1. Add a Markdown file such as `posts/my-new-note.md`.
2. Start the file with a level-one title (`# My new note`) and write the rest in Markdown.
3. Regenerate the post index:

   ```bash
   python3 scripts/generate_posts_meta.py
   ```

4. Preview the site locally:

   ```bash
   ./test-server.sh
   ```

   Then open `http://localhost:8000`.

5. Publish both the post and generated index:

   ```bash
   git add posts/my-new-note.md data/posts.json
   git commit -m "Add my new note"
   git push
   ```

The included GitHub Actions workflow also regenerates `data/posts.json` when Markdown files under `posts/` change. Committing the generated file locally keeps the repository and preview in sync immediately.

## Publish from the browser editor

Open `admin.html`, expand **GitHub publishing settings**, and provide the repository owner, repository name, branch, and a fine-grained personal access token. The token needs **Contents: Read and write** access to this repository. Select **Publish post** to commit the Markdown file and updated index together.

Treat an access token like a password. Use a short expiration, grant access only to this repository, never put it in a source file, and revoke it from GitHub if it is exposed. The editor keeps the token only for the current browser tab.

## Update or remove a post

- **Update:** edit its file in `posts/`, regenerate metadata, commit, and push.
- **Remove:** delete its Markdown file, regenerate metadata, commit both changes, and push.
- **Check deployment:** open the repository's **Actions** tab. A green Pages deployment means the current commit is live.

## Optional custom domain

Enter the domain under **Settings → Pages → Custom domain**, then create the DNS records requested by GitHub at your DNS provider. Enable **Enforce HTTPS** after GitHub validates the domain. Keep GitHub's generated `CNAME` file in the repository.

## Common problems

- **The page is blank or old:** check the **Actions** tab for a failed deployment, then hard-refresh the browser.
- **A post is missing:** run the metadata generator and confirm the resulting entry exists in `data/posts.json`.
- **A link works locally but not online:** paths and filenames on Pages are case-sensitive. Match capitalization exactly and prefer relative paths.
- **The site returns 404:** confirm Pages is enabled for `main` and `/ (root)`, and confirm the repository name and public URL.
- **A custom domain fails:** verify the DNS records and `CNAME` file; DNS changes can take time to propagate.
