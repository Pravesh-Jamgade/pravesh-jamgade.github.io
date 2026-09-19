# Private viewership analytics

The old counter used browser `localStorage`. It counted only visits made in that one browser, so it could not provide site-wide analytics. It also requested every reader's location from a third-party IP service. That code has been removed.

## Recommended setup: Cloudflare Web Analytics

Cloudflare Web Analytics works with a site hosted on GitHub Pages, does not require moving the site to Cloudflare, and keeps reports behind your Cloudflare account login.

1. Create or sign in to a Cloudflare account.
2. Open **Analytics & Logs → Web Analytics**, then choose **Add a site**.
3. Enter the published website hostname and copy the JavaScript beacon Cloudflare provides.
4. Paste that beacon immediately before `</body>` in `index.html`, `post.html`, and `about.html`.
5. Deploy the changes, visit the live site once, and confirm traffic appears in the Cloudflare dashboard.
6. Keep the Cloudflare account private, enable two-factor authentication, and invite another administrator through Cloudflare rather than sharing a password.

The generated beacon will look similar to this (use the actual token Cloudflare gives you):

```html
<script defer src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "YOUR_SITE_TOKEN"}'></script>
```

The token in page source identifies the site; it does **not** grant access to the analytics dashboard. Only users authorized in the Cloudflare account can see the reports.

## Important admin note

`admin.html` is a static page. A hidden URL is not authentication: any visitor who knows the address can open it. It also cannot see other visitors' `localStorage`. Use the authenticated Cloudflare dashboard for analytics, and use GitHub repository permissions as the source of truth for publishing posts.

If the on-site editor is retained, do not place analytics API keys, account credentials, or private data in its HTML or JavaScript; everything shipped by GitHub Pages is public.
