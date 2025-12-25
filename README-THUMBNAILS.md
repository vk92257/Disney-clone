# How to Add Movie Thumbnails

## Current Video
- **Jolly LLB 3** - `/public/video/Jolly.LLB-3.2025.720p.DS4K.Hindi.WEB-DL.5.1.ESub.x264-HDHub4u.Ms.mkv`

## Quick Start - Extract Thumbnail from Video (Easiest)

If you have `ffmpeg` installed:

```bash
npm run extract-thumbnail public/video/Jolly.LLB-3.2025.720p.DS4K.Hindi.WEB-DL.5.1.ESub.x264-HDHub4u.Ms.mkv public/images/jolly-llb-3-poster.jpg 5
```

This will create:
- `jolly-llb-3-poster.jpg` (original)
- `jolly-llb-3-poster-card.jpg` (400x600 for card)
- `jolly-llb-3-poster-bg.jpg` (1920x1080 for background)

Then rename them:
```bash
mv public/images/jolly-llb-3-poster-card.jpg public/images/jolly-llb-3-poster.jpg
mv public/images/jolly-llb-3-poster-bg.jpg public/images/jolly-llb-3-background.jpg
cp public/images/jolly-llb-3-poster.jpg public/images/jolly-llb-3-title.png
```

## Option 1: Use Online Movie Database (Recommended)

1. **The Movie Database (TMDB)** - https://www.themoviedb.org/
   - Search for "Jolly LLB 3"
   - Download poster images
   - Use API: `https://image.tmdb.org/t/p/w500/{poster_path}`

2. **IMDb** - https://www.imdb.com/
   - Search for the movie
   - Right-click on poster image and save

3. **Save images to `/public/images/`**:
   - `jolly-llb-3-poster.jpg` (400x600px for cardImg)
   - `jolly-llb-3-background.jpg` (1920x1080px for backgroundImg)
   - `jolly-llb-3-title.png` (1440x400px for titleImg, can use same as poster)

## Option 2: Extract from Video Manually

1. Open video in VLC or any video player
2. Find a good frame (usually 5-10 seconds in)
3. Take screenshot
4. Save to `/public/images/` folder
5. Resize images to recommended sizes

## Option 3: Use Online Image URLs

Update `src/MoviesData.json` with direct URLs:

```json
{
  "cardImg": "https://example.com/poster.jpg",
  "backgroundImg": "https://example.com/background.jpg",
  "titleImg": "https://example.com/title.png"
}
```

## Image Requirements

- **cardImg**: `/images/jolly-llb-3-poster.jpg` - 400x600px (portrait)
- **backgroundImg**: `/images/jolly-llb-3-background.jpg` - 1920x1080px (landscape)
- **titleImg**: `/images/jolly-llb-3-title.png` - 1440x400px (logo/title, PNG preferred)

## Current Configuration

The `MoviesData.json` is already configured to use local images:
- All paths point to `/images/jolly-llb-3-*.jpg` or `.png`
- Just add the image files to `/public/images/` folder
- Refresh your app to see the thumbnails!

## Need Help?

If you don't have ffmpeg installed:
- **macOS**: `brew install ffmpeg`
- **Windows**: Download from https://ffmpeg.org/download.html
- **Linux**: `sudo apt-get install ffmpeg`

