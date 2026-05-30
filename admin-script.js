// Admin Panel Script - Markdown File Based
const POSTS_META_KEY = 'blog_posts_meta';
const POST_VIEWS_KEY = 'blog_post_views';
const VISITOR_LOG_KEY = 'blog_visitor_log';
let currentEditingId = null;
let postsMeta = {};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeDateInput();
    loadPostsList();
    setupEventListeners();
    displayVisitorLog();
});

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

function savePost(event) {
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

    // Persist metadata to localStorage (sorted newest first)
    const postsArray = Object.values(postsMeta).sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem(POSTS_META_KEY, JSON.stringify(postsArray));

    // Provide markdown file content for download
    const markdownContent = `# ${title}\n\n${content}`;
    downloadFile(markdownContent, filename);

    // Also prepare an updated posts metadata JSON for the repository.
    // This downloads a file named 'data-posts.json' — replace your repository's
    // `data/posts.json` with this file (rename when saving) and commit.
    const postsJsonContent = JSON.stringify(postsArray, null, 2);
    downloadFile(postsJsonContent, 'data-posts.json');

    alert(`Post saved!\n\nFiles downloaded:\n- ${filename} (markdown)\n- data-posts.json (updated metadata)\n\nNext steps:\n1. Move '${filename}' into the 'posts' folder in your repo.\n2. Replace 'data/posts.json' with the downloaded 'data-posts.json' file (rename to data/posts.json).\n3. Commit and push to GitHub.`);

    hideEditor();
    loadPostsList();
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
                // Remove title from markdown (it's already in the form)
                const lines = content.split('\n');
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
                <span>${getPostViews(post.id)} views</span>
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
5. Click "Save Post"
6. Download the markdown file
7. Add the file to your 'posts' folder
8. Commit and push to GitHub

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


function getPostViews(postId) {
    const views = JSON.parse(localStorage.getItem(POST_VIEWS_KEY) || '{}');
    return views[postId] || 0;
}
