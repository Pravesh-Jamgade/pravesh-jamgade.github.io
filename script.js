const POSTS_META_KEY = 'blog_posts_meta';
const POSTS_META_CACHE_KEY = 'blog_posts_meta_cache';
const POSTS_SYNC_TS_KEY = 'blog_posts_meta_sync_ts';
const POST_VIEWS_KEY = 'blog_post_views';
const VISITOR_LOG_KEY = 'blog_visitor_log';
const LOCATION_ACCESS_KEY = 'blog_location_access';
const POST_AVAILABILITY_KEY = 'blog_post_availability';

const POSTS_SYNC_INTERVAL_MS = 5 * 60 * 1000;
const AVAILABILITY_CHECK_INTERVAL_MS = 12 * 60 * 60 * 1000;

// Load and display blog posts list
async function loadBlogList() {
    try {
        const posts = await loadPostsMetadata();
        const availablePosts = await filterAvailablePosts(posts);

        const postsList = document.getElementById('posts-list');

        if (availablePosts.length === 0) {
            postsList.innerHTML = '<p>No posts published yet.</p>';
            return;
        }

        const postsHTML = availablePosts.map(post => {
            const views = getPostViews(post.id);
            return `
            <div class="blog-item">
                <a href="post.html?id=${post.id}" class="blog-line">
                    <span class="line-title">${post.title}</span>
                    <span>${formatDate(post.date)}</span>
                    <span>${views} views</span>
                    <span>${post.category}</span>
                </a>
            </div>
        `;
        }).join('');

        postsList.innerHTML = `<div class="blog-list">${postsHTML}</div>`;
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('posts-list').innerHTML = '<p>Error loading posts. Please try again later.</p>';
    }
}

// Load and display individual post
async function loadPost() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        if (!postId) {
            document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
            return;
        }

        const posts = await loadPostsMetadata();
        const post = posts.find(p => p.id === postId);

        if (!post) {
            document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
            return;
        }

        incrementPostViews(post.id);
        await trackVisitor(post);

        document.title = post.title + ' - Research Blog';

        // Load markdown content from file
        try {
            const response = await fetch(`posts/${post.filename}`);
            if (!response.ok) throw new Error('File not found');

            const markdown = await response.text();
            const html = marked.parse(markdown);

            const postHTML = `
                <div class="post-header">
                    <h1>${post.title}</h1>
                    <div class="post-meta">
                        <span>📅 ${formatDate(post.date)}</span>
                        <span>🏷️ ${post.category}</span>
                    </div>
                </div>
                <div class="post-body">
                    ${html}
                </div>
            `;

            document.getElementById('post-content').innerHTML = postHTML;
        } catch (error) {
            console.error('Error loading post file:', error);
            document.getElementById('post-content').innerHTML = `
                <p>Post content not found. The markdown file may not be available yet.</p>
            `;
        }
    } catch (error) {
        console.error('Error loading post:', error);
        document.getElementById('post-content').innerHTML = '<p>Error loading post. Please try again later.</p>';
    }
}

// Load posts metadata with local caching + periodic auto refresh from JSON
async function loadPostsMetadata() {
    // Always attempt to fetch fresh metadata from the server (bypass caches).
    // If the fetch fails, fall back to localStorage so cached clients still work.
    const stored = parseJSON(localStorage.getItem(POSTS_META_KEY), []);

    try {
        const response = await fetch(`data/posts.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Unable to load posts metadata');

        const fetchedPosts = await response.json();
        if (!Array.isArray(fetchedPosts)) throw new Error('Invalid posts metadata format');

        const normalizedPosts = normalizePosts(fetchedPosts);
        const cachedHash = localStorage.getItem(POSTS_META_CACHE_KEY);
        const newHash = createPostsHash(normalizedPosts);

        if (cachedHash !== newHash) {
            localStorage.setItem(POSTS_META_KEY, JSON.stringify(normalizedPosts));
            localStorage.setItem(POSTS_META_CACHE_KEY, newHash);
        }

        localStorage.setItem(POSTS_SYNC_TS_KEY, String(Date.now()));
        return normalizedPosts;
    } catch (error) {
        // Network or server error — fall back to whatever we have in localStorage.
        console.warn('Could not fetch fresh posts metadata, using cached copy:', error);
        return normalizePosts(stored);
    }
}

function normalizePosts(posts) {
    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function createPostsHash(posts) {
    return JSON.stringify(posts.map(({ id, title, filename, date }) => ({ id, title, filename, date })));
}

async function filterAvailablePosts(posts) {
    const availabilityMap = parseJSON(localStorage.getItem(POST_AVAILABILITY_KEY), {});
    const now = Date.now();
    const updates = {};

    const checks = posts.map(async (post) => {
        const cached = availabilityMap[post.id];
        if (cached && now - cached.checkedAt < AVAILABILITY_CHECK_INTERVAL_MS) {
            return { post, available: cached.available };
        }

        const available = await isPostAvailable(post.filename);
        updates[post.id] = { available, checkedAt: now };
        return { post, available };
    });

    const results = await Promise.all(checks);

    if (Object.keys(updates).length > 0) {
        localStorage.setItem(POST_AVAILABILITY_KEY, JSON.stringify({ ...availabilityMap, ...updates }));
    }

    return results.filter(r => r.available).map(r => r.post);
}

async function isPostAvailable(filename) {
    try {
        const response = await fetch(`posts/${filename}`, { method: 'HEAD', cache: 'no-store' });
        return response.ok;
    } catch {
        return false;
    }
}

function parseJSON(raw, fallback) {
    try {
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

// Format date to readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function getViewsMap() {
    return parseJSON(localStorage.getItem(POST_VIEWS_KEY), {});
}

function getPostViews(postId) {
    return getViewsMap()[postId] || 0;
}

function incrementPostViews(postId) {
    const viewMap = getViewsMap();
    viewMap[postId] = (viewMap[postId] || 0) + 1;
    localStorage.setItem(POST_VIEWS_KEY, JSON.stringify(viewMap));
}

function getLocationAccessMap() {
    return parseJSON(localStorage.getItem(LOCATION_ACCESS_KEY), {});
}

function updateLocationAccess(post, location) {
    const map = getLocationAccessMap();
    const postBucket = map[post.id] || {
        postTitle: post.title,
        total: 0,
        locations: {}
    };

    const locationKey = [location.city, location.region, location.country].join(', ');

    postBucket.total += 1;
    postBucket.locations[locationKey] = (postBucket.locations[locationKey] || 0) + 1;

    map[post.id] = postBucket;
    localStorage.setItem(LOCATION_ACCESS_KEY, JSON.stringify(map));
}

async function trackVisitor(post) {
    const location = await getVisitorLocation();
    const logs = parseJSON(localStorage.getItem(VISITOR_LOG_KEY), []);

    logs.unshift({
        time: new Date().toISOString(),
        postId: post.id,
        postTitle: post.title,
        city: location.city,
        region: location.region,
        country: location.country
    });

    localStorage.setItem(VISITOR_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
    updateLocationAccess(post, location);
}

async function getVisitorLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Location lookup failed');
        const data = await response.json();
        return {
            city: data.city || 'Unknown city',
            region: data.region || 'Unknown region',
            country: data.country_name || 'Unknown country'
        };
    } catch (error) {
        return { city: 'Unknown city', region: 'Unknown region', country: 'Unknown country' };
    }
}
