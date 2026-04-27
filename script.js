const POSTS_META_KEY = 'blog_posts_meta';

// Load and display blog posts list
async function loadBlogList() {
    try {
        let posts = await loadPostsMetadata();

        const postsList = document.getElementById('posts-list');

        if (posts.length === 0) {
            postsList.innerHTML = '<p>No posts yet. <a href="admin.html">Create your first post</a>!</p>';
            return;
        }

        const postsHTML = posts.map(post => `
            <div class="blog-item">
                <h2><a href="post.html?id=${post.id}">${post.title}</a></h2>
                <div class="blog-meta">
                    <span>📅 ${formatDate(post.date)}</span>
                    <span>🏷️ ${post.category}</span>
                </div>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="post.html?id=${post.id}" class="read-more">Read More →</a>
            </div>
        `).join('');

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
                <p>Post content not found. The markdown file may not be committed to the repository yet.</p>
                <p><a href="admin.html">Go to admin panel</a> to manage posts.</p>
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
