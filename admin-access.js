// Admin Panel Access via Keyboard Shortcut
// Press Ctrl+Shift+A to go to admin panel

document.addEventListener('keydown', function(event) {
    // Ctrl+Shift+A (Windows/Linux) or Cmd+Shift+A (Mac)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        window.location.href = 'admin.html';
    }
});
