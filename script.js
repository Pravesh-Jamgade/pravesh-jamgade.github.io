const POSTS_META_KEY = 'blog_posts_meta';
const POST_VIEWS_KEY = 'blog_post_views';
const VISITOR_LOG_KEY = 'blog_visitor_log';

// Load and display blog posts list
async function loadBlogList() {
    try {
        let posts = await loadPostsMetadata();

        const postsList = document.getElementById('posts-list');

        if (posts.length === 0) {
            postsList.innerHTML = '<p>No posts published yet.</p>';
            return;
        }

        const postsHTML = posts.map(post => {
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

        let posts = await loadPostsMetadata();
        const post = posts.find(p => p.id === postId);

        if (!post) {
            document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
            return;
        }

        incrementPostViews(post.id);
        trackVisitor(post);

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

// Load posts metadata from localStorage or JSON
async function loadPostsMetadata() {
    // Try localStorage first
    const stored = localStorage.getItem(POSTS_META_KEY);
    if (stored) {
        return JSON.parse(stored);
    }

    // Load from data/posts.json
    try {
        const response = await fetch('data/posts.json');
        const posts = await response.json();
        localStorage.setItem(POSTS_META_KEY, JSON.stringify(posts));
        return posts;
    } catch (error) {
        console.error('Error loading posts metadata:', error);
        return [];
    }
}

// Format date to readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}


function getViewsMap() {
    return JSON.parse(localStorage.getItem(POST_VIEWS_KEY) || '{}');
}

function getPostViews(postId) {
    return getViewsMap()[postId] || 0;
}

function incrementPostViews(postId) {
    const viewMap = getViewsMap();
    viewMap[postId] = (viewMap[postId] || 0) + 1;
    localStorage.setItem(POST_VIEWS_KEY, JSON.stringify(viewMap));
}


async function trackVisitor(post) {
    const location = await getVisitorLocation();
    const logs = JSON.parse(localStorage.getItem(VISITOR_LOG_KEY) || '[]');
    logs.unshift({
        time: new Date().toISOString(),
        postId: post.id,
        postTitle: post.title,
        city: location.city,
        region: location.region,
        country: location.country
    });
    localStorage.setItem(VISITOR_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
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
