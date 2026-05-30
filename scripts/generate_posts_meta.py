#!/usr/bin/env python3
"""
Scan the `posts/` folder and generate `data/posts.json` with metadata entries.

Usage:
  python3 scripts/generate_posts_meta.py

This script will back up the existing `data/posts.json` to
`data/posts.json.bak` (if present) and overwrite `data/posts.json` with a
normalized array of post metadata objects.
"""
import json
import os
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POSTS_DIR = ROOT / 'posts'
DATA_DIR = ROOT / 'data'
OUT_FILE = DATA_DIR / 'posts.json'


def slug_to_title(slug: str) -> str:
    name = slug.replace('-', ' ').replace('_', ' ')
    return ' '.join([p.capitalize() for p in name.split()])


def extract_title_and_excerpt(text: str):
    # Look for a first-level heading
    for line in text.splitlines():
        line = line.strip()
        if line.startswith('# '):
            title = line[2:].strip()
            break
    else:
        title = None

    # Find first paragraph-like block for excerpt
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    excerpt = None
    for p in paragraphs:
        if p.lower().startswith('author:') or p.lower().startswith('keywords:'):
            continue
        if p.startswith('#'):
            continue
        # take first reasonable paragraph
        if len(p) > 20:
            excerpt = p.replace('\n', ' ').strip()
            break

    return title, excerpt


def file_date(path: Path) -> str:
    ts = path.stat().st_mtime
    return datetime.fromtimestamp(ts).strftime('%Y-%m-%d')


def build_meta_for_file(path: Path):
    text = path.read_text(encoding='utf-8')
    title, excerpt = extract_title_and_excerpt(text)
    slug = path.stem
    meta = {
        'id': slug,
        'title': title or slug_to_title(slug),
        'date': file_date(path),
        'category': 'General',
        'excerpt': excerpt or '',
        'filename': path.name
    }
    return meta


def main():
    if not POSTS_DIR.exists():
        print('No posts/ directory found at', POSTS_DIR)
        return

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    posts = []
    for f in sorted(POSTS_DIR.glob('*.md')):
        meta = build_meta_for_file(f)
        posts.append(meta)

    # sort newest first by date
    posts.sort(key=lambda p: p.get('date', ''), reverse=True)

    # backup existing
    if OUT_FILE.exists():
        bak = OUT_FILE.with_suffix('.json.bak')
        bak.write_text(OUT_FILE.read_text(encoding='utf-8'), encoding='utf-8')
        print('Backed up', OUT_FILE, '->', bak)

    OUT_FILE.write_text(json.dumps(posts, indent=2, ensure_ascii=False), encoding='utf-8')
    print('Wrote', OUT_FILE, 'with', len(posts), 'entries')


if __name__ == '__main__':
    main()
