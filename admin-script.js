// Admin Panel Script - Markdown File Based
const POSTS_META_KEY = 'blog_posts_meta';
let currentEditingId = null;
let postsMeta = {};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeDateInput();
    initializePublishingSettings();
    loadPostsList();
    setupEventListeners();
});

function initializePublishingSettings() {
    const hostParts = window.location.hostname.split('.');
    const inferredOwner = hostParts.length > 2 && hostParts.slice(-2).join('.') === 'github.io'
        ? hostParts[0]
        : 'Pravesh-Jamgade';
    document.getElementById('github-owner').value = localStorage.getItem('github_owner') || inferredOwner;
    document.getElementById('github-repo').value = localStorage.getItem('github_repo') || `${inferredOwner}.github.io`;
    document.getElementById('github-branch').value = localStorage.getItem('github_branch') || 'main';
    document.getElementById('github-token').value = sessionStorage.getItem('github_token') || '';
}

function initializeDateInput() {
    const dateInput = document.getElementById('post-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

function setupEventListeners() {
    // Main buttons
    document.getElementById('new-post-btn').addEventListener('click', showEditor);
    document.getElementById('cancel-btn').addEventListener('click', hideEditor);
    document.getElementById('export-btn').addEventListener('click', exportAllPosts);
    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importPosts);

    // Form events
    document.getElementById('post-form').addEventListener('submit', savePost);
    document.getElementById('insert-image-btn').addEventListener('click', insertImageMarkdown);
    document.getElementById('preview-btn').addEventListener('click', togglePreview);

    // Toolbar buttons
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        if (!btn.id && !btn.getAttribute('data-format').includes('Image') && !btn.id.includes('preview')) {
            btn.addEventListener('click', insertMarkdown);
        }
    });

    document.getElementById('help-btn').addEventListener('click', showHelp);
}

function showEditor(event) {
    if (event) event.preventDefault();
    currentEditingId = null;
    resetForm();
    document.getElementById('editor-section').style.display = 'block';
    document.getElementById('editor-title').textContent = 'New Post';
    document.getElementById('post-form').scrollIntoView({ behavior: 'smooth' });
}

function hideEditor(event) {
    if (event) event.preventDefault();
    document.getElementById('editor-section').style.display = 'none';
    document.getElementById('preview-area').style.display = 'none';
    document.getElementById('publish-status').textContent = '';
    resetForm();
    currentEditingId = null;
}

function resetForm() {
    document.getElementById('post-form').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('post-date').value = today;
    document.getElementById('preview-area').style.display = 'none';
}

function insertMarkdown(event) {
    event.preventDefault();
    const format = event.target.closest('.toolbar-btn').dataset.format;
    insertAtCursor(document.getElementById('post-content'), format);
}

function insertImageMarkdown(event) {
    event.preventDefault();
    const imageName = prompt('Enter image filename (e.g., my-image.jpg):', '');
    if (!imageName) return;

    const markdown = `![${imageName}](./images/${imageName})`;
    insertAtCursor(document.getElementById('post-content'), markdown);
}

function insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    if (selectedText) {
        textarea.value = before + text + selectedText + text + after;
    } else {
        textarea.value = before + text + after;
    }

    textarea.selectionStart = start + text.length;
    textarea.selectionEnd = start + text.length;
    textarea.focus();
    updatePreview();
}

function togglePreview(event) {
    event.preventDefault();
    const previewArea = document.getElementById('preview-area');
    previewArea.style.display = previewArea.style.display === 'none' ? 'block' : 'none';
    if (previewArea.style.display === 'block') {
        updatePreview();
    }
}

function updatePreview() {
    const markdown = document.getElementById('post-content').value;
    const html = marked.parse(markdown);
    document.getElementById('preview-content').innerHTML = html;
}

async function savePost(event) {
    event.preventDefault();

    const title = document.getElementById('post-title').value;
    const date = document.getElementById('post-date').value;
    const category = document.getElementById('post-category').value;
    const excerpt = document.getElementById('post-excerpt').value;
    const content = document.getElementById('post-content').value;

    if (!title || !date || !category || !excerpt || !content) {
        alert('Please fill in all required fields');
        return;
    }

    // Generate filename from title
    const filename = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '.md';

    const postMeta = {
        id: currentEditingId || 'post_' + Date.now(),
        title: title,
        date: date,
        category: category,
        excerpt: excerpt,
        filename: filename
    };

    if (currentEditingId) {
        const index = Object.keys(postsMeta).indexOf(currentEditingId);
        if (index !== -1) {
            delete postsMeta[currentEditingId];
        }
    }

    postsMeta[postMeta.id] = postMeta;

    // Build the two repository files that make up a post.
    const postsArray = Object.values(postsMeta).sort((a, b) => new Date(b.date) - new Date(a.date));
    const markdownContent = `---\ntitle: ${JSON.stringify(title)}\ndate: ${date}\ncategory: ${JSON.stringify(category)}\nexcerpt: ${JSON.stringify(excerpt)}\n---\n\n# ${title}\n\n${content}`;
    const postsJsonContent = JSON.stringify(postsArray, null, 2);

    const publishButton = document.getElementById('publish-btn');
    const status = document.getElementById('publish-status');
    publishButton.disabled = true;
    publishButton.textContent = 'Publishing…';
    status.className = 'publish-status';
    status.textContent = 'Creating a commit on GitHub…';

    try {
        const settings = getPublishingSettings();
        await publishToGitHub(settings, {
            [`posts/${filename}`]: markdownContent,
            'data/posts.json': postsJsonContent
        }, currentEditingId ? `Update post: ${title}` : `Publish post: ${title}`);

        localStorage.setItem(POSTS_META_KEY, JSON.stringify(postsArray));
        status.className = 'publish-status success';
        status.textContent = 'Published. GitHub Pages will update in a moment.';
        currentEditingId = postMeta.id;
        displayPostsList();
    } catch (error) {
        console.error('Publishing failed:', error);
        status.className = 'publish-status error';
        status.textContent = error.message;
    } finally {
        publishButton.disabled = false;
        publishButton.textContent = 'Publish post';
    }
}

function getPublishingSettings() {
    const owner = document.getElementById('github-owner').value.trim();
    const repo = document.getElementById('github-repo').value.trim();
    const branch = document.getElementById('github-branch').value.trim();
    const token = document.getElementById('github-token').value.trim();
    if (!owner || !repo || !branch || !token) {
        throw new Error('Open GitHub publishing settings and complete all four fields.');
    }
    localStorage.setItem('github_owner', owner);
    localStorage.setItem('github_repo', repo);
    localStorage.setItem('github_branch', branch);
    sessionStorage.setItem('github_token', token);
    return { owner, repo, branch, token };
}

async function githubRequest(settings, path, options = {}) {
    const response = await fetch(`https://api.github.com${path}`, {
        ...options,
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${settings.token}`,
            'X-GitHub-Api-Version': '2022-11-28',
            ...(options.headers || {})
        }
    });
    if (!response.ok) {
        let detail = '';
        try { detail = (await response.json()).message; } catch { detail = response.statusText; }
        throw new Error(`GitHub could not publish (${response.status}): ${detail}`);
    }
    return response.status === 204 ? null : response.json();
}

// Use Git's tree API so the Markdown and index are published in one atomic commit.
async function publishToGitHub(settings, files, message) {
    const basePath = `/repos/${encodeURIComponent(settings.owner)}/${encodeURIComponent(settings.repo)}`;
    const ref = await githubRequest(settings, `${basePath}/git/ref/heads/${encodeURIComponent(settings.branch)}`);
    const parentSha = ref.object.sha;
    const parent = await githubRequest(settings, `${basePath}/git/commits/${parentSha}`);

    const tree = await Promise.all(Object.entries(files).map(async ([path, content]) => {
        const blob = await githubRequest(settings, `${basePath}/git/blobs`, {
            method: 'POST',
            body: JSON.stringify({ content, encoding: 'utf-8' })
        });
        return { path, mode: '100644', type: 'blob', sha: blob.sha };
    }));

    const nextTree = await githubRequest(settings, `${basePath}/git/trees`, {
        method: 'POST',
        body: JSON.stringify({ base_tree: parent.tree.sha, tree })
    });
    const commit = await githubRequest(settings, `${basePath}/git/commits`, {
        method: 'POST',
        body: JSON.stringify({ message, tree: nextTree.sha, parents: [parentSha] })
    });
    await githubRequest(settings, `${basePath}/git/refs/heads/${encodeURIComponent(settings.branch)}`, {
        method: 'PATCH',
        body: JSON.stringify({ sha: commit.sha, force: false })
    });
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

function editPost(id) {
    currentEditingId = id;
    const post = postsMeta[id];

    if (post) {
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-date').value = post.date;
        document.getElementById('post-category').value = post.category;
        document.getElementById('post-excerpt').value = post.excerpt;

        // Load markdown content from file
        fetch(`posts/${post.filename}`)
            .then(response => response.text())
            .then(content => {
                // Remove generated front matter and title (they are already in the form).
                const lines = content.replace(/^---\n[\s\S]*?\n---\n+/, '').split('\n');
                if (lines[0].startsWith('# ')) {
                    lines.shift();
                    if (lines[0].trim() === '') lines.shift();
                }
                document.getElementById('post-content').value = lines.join('\n').trim();
            })
            .catch(error => {
                console.error('Error loading post content:', error);
                alert('Could not load post content. It may not be committed to the repository yet.');
            });

        document.getElementById('editor-title').textContent = 'Edit Post';
        document.getElementById('editor-section').style.display = 'block';
        document.getElementById('post-form').scrollIntoView({ behavior: 'smooth' });
    }
}

function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post? You\'ll need to manually delete the markdown file from the posts folder.')) {
        return;
    }

    const post = postsMeta[id];
    delete postsMeta[id];
    localStorage.setItem(POSTS_META_KEY, JSON.stringify(Object.values(postsMeta)));
    loadPostsList();
    alert(`Post metadata deleted. Don't forget to delete '${post.filename}' from the 'posts' folder!`);
}

function loadPostsList() {
    // Load from localStorage first
    const stored = localStorage.getItem(POSTS_META_KEY);
    if (stored) {
        const posts = JSON.parse(stored);
        postsMeta = {};
        posts.forEach(post => {
            postsMeta[post.id] = post;
        });
    } else {
        // Load from data/posts.json on first visit
        fetch('data/posts.json')
            .then(response => response.json())
            .then(posts => {
                postsMeta = {};
                posts.forEach(post => {
                    postsMeta[post.id] = post;
                });
                localStorage.setItem(POSTS_META_KEY, JSON.stringify(posts));
                displayPostsList();
            })
            .catch(error => console.error('Error loading posts:', error));
        return;
    }

    displayPostsList();
}

function displayPostsList() {
    const posts = Object.values(postsMeta);
    const listContainer = document.getElementById('posts-list-admin');

    if (posts.length === 0) {
        listContainer.innerHTML = '<p>No posts yet. Click "New Post" to create one!</p>';
        return;
    }

    listContainer.innerHTML = posts.map(post => `
        <div class="post-row">
            <div class="post-row-main">
                <strong>${post.title}</strong>
                <span>${post.date}</span>
                <span>${post.category}</span>
            </div>
            <div class="post-row-actions">
                <button class="btn btn-secondary btn-small" onclick="editPost('${post.id}')">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deletePost('${post.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function exportAllPosts() {
    const posts = Object.values(postsMeta);
    const dataStr = JSON.stringify(posts, null, 2);
    downloadFile(dataStr, `blog_posts_backup_${new Date().toISOString().split('T')[0]}.json`);
    alert('Posts metadata exported! This contains the structure of your posts. The actual content is in the markdown files.');
}

function importPosts(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const posts = JSON.parse(e.target.result);
            if (Array.isArray(posts)) {
                if (confirm('This will replace all post metadata. Continue?')) {
                    postsMeta = {};
                    posts.forEach(post => {
                        postsMeta[post.id] = post;
                    });
                    localStorage.setItem(POSTS_META_KEY, JSON.stringify(posts));
                    displayPostsList();
                    alert('Posts metadata imported!');
                }
            } else {
                alert('Invalid file format');
            }
        } catch (error) {
            alert('Error reading file: ' + error.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function showHelp() {
    alert(`
📝 Blog Admin Help

ADD POSTS:
1. Click "+ New Post"
2. Fill in title, date, category, excerpt
3. Write content in Markdown
4. Use toolbar for quick formatting
5. Open GitHub publishing settings and add a fine-grained token
6. Click "Publish post"
7. The post and index are committed to GitHub automatically

EDIT POSTS:
1. Click "Edit" on a post
2. Modify the content
3. Click "Save Post"
4. Update the markdown file in your repo

DELETE POSTS:
1. Click "Delete"
2. Remove the markdown file from 'posts' folder
3. Commit and push

MARKDOWN FORMATTING:
- **bold** for bold
- *italic* for italic
- # Heading, ## Subheading
- - Item for lists
- ![image alt](./images/file.jpg) for images

IMAGES:
1. Add images to the 'images' folder
2. Reference in markdown: ![alt](./images/name.jpg)
3. Commit to GitHub

BACKUP:
- Click "⬇️ Export Posts" to backup metadata
- Keep both the JSON and markdown files safe!

The system stores:
- Metadata (title, date, etc.) in data/posts.json
- Content in posts/*.md files
- Images in images/ folder
`);
}
