#!/bin/bash

# Blog Site Test Server
# Quickly start a local server to test your blog before deploying

echo "🚀 Starting Blog Test Server..."
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found!"
    echo "Please run this script from the blog directory"
    exit 1
fi

echo "✅ Files found!"
echo ""
echo "📂 Checking directory structure..."
echo ""

# Check for required files
REQUIRED_FILES="index.html post.html about.html admin.html styles.css script.js data/posts.json"
MISSING=0

for file in $REQUIRED_FILES; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - MISSING!"
        MISSING=$((MISSING + 1))
    fi
done

echo ""
echo "📁 Checking directories..."
if [ -d "posts" ]; then
    POST_COUNT=$(find posts -name "*.md" 2>/dev/null | wc -l)
    echo "  ✅ posts/ (contains $POST_COUNT posts)"
else
    echo "  ❌ posts/ - MISSING!"
fi

if [ -d "images" ]; then
    echo "  ✅ images/"
else
    echo "  ⚠️  images/ - not found (optional)"
fi

if [ -d "data" ]; then
    echo "  ✅ data/"
else
    echo "  ❌ data/ - MISSING!"
fi

echo ""

if [ "$MISSING" -gt 0 ]; then
    echo "⚠️  Some files are missing. Fix them and try again."
    exit 1
fi

echo "🎉 All required files found!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📍 Test Server Starting"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Open your browser to:"
echo ""
echo "   http://localhost:8000"
echo ""
echo "📋 What to test:"
echo "   • Homepage displays correctly"
echo "   • Posts show in the list"
echo "   • Click posts to view full content"
echo "   • Check 'About' page"
echo "   • Test 'Admin' panel"
echo "   • Press F12 → Console for errors"
echo ""
echo "📱 Test on mobile:"
echo "   Get your IP: hostname -I (or ipconfig on Windows)"
echo "   Then go to: http://YOUR_IP:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Try to open browser
if command -v open >/dev/null 2>&1; then
    # macOS
    open "http://localhost:8000" 2>/dev/null &
elif command -v xdg-open >/dev/null 2>&1; then
    # Linux
    xdg-open "http://localhost:8000" 2>/dev/null &
fi

# Start server with Python
if command -v python3 >/dev/null 2>&1; then
    python3 -m http.server 8000
elif command -v python >/dev/null 2>&1; then
    python -m http.server 8000
else
    echo "❌ Error: Python is not installed!"
    echo "Please install Python 3 to run the test server"
    exit 1
fi
