@echo off
REM Blog Site Test Server for Windows
REM Quickly start a local server to test your blog before deploying

setlocal enabledelayedexpansion

echo.
echo 🚀 Starting Blog Test Server...
echo.

REM Check if we're in the right directory
if not exist "index.html" (
    echo ❌ Error: index.html not found!
    echo Please run this script from the blog directory
    pause
    exit /b 1
)

echo ✅ Files found!
echo.
echo 📂 Checking directory structure...
echo.

REM Check for required files
set MISSING=0

for %%F in (index.html post.html about.html admin.html styles.css script.js) do (
    if exist "%%F" (
        echo   ✅ %%F
    ) else (
        echo   ❌ %%F - MISSING!
        set /a MISSING+=1
    )
)

if exist "data\posts.json" (
    echo   ✅ data/posts.json
) else (
    echo   ❌ data/posts.json - MISSING!
    set /a MISSING+=1
)

echo.
echo 📁 Checking directories...

if exist "posts\" (
    echo   ✅ posts/
) else (
    echo   ❌ posts/ - MISSING!
    set /a MISSING+=1
)

if exist "images\" (
    echo   ✅ images/
) else (
    echo   ⚠️  images/ - not found (optional)
)

if exist "data\" (
    echo   ✅ data/
) else (
    echo   ❌ data/ - MISSING!
    set /a MISSING+=1
)

echo.

if !MISSING! gtr 0 (
    echo ⚠️  Some files are missing. Fix them and try again.
    pause
    exit /b 1
)

echo 🎉 All required files found!
echo.
echo ════════════════════════════════════════════════════
echo 📍 Test Server Starting on Port 8000
echo ════════════════════════════════════════════════════
echo.
echo 🌐 Open your browser to:
echo.
echo    http://localhost:8000
echo.
echo 📋 What to test:
echo    • Homepage displays correctly
echo    • Posts show in the list
echo    • Click posts to view full content
echo    • Check 'About' page
echo    • Test 'Admin' panel
echo    • Press F12 → Console for errors
echo.
echo 📱 Test on mobile:
echo    Open Command Prompt and type: ipconfig
echo    Find your IPv4 address (e.g., 192.168.1.100)
echo    Then go to: http://YOUR_IP:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ════════════════════════════════════════════════════
echo.

REM Try to open browser
start http://localhost:8000

REM Start Python server
python -m http.server 8000

REM If Python not found, try python3
if errorlevel 1 (
    python3 -m http.server 8000
)

pause
