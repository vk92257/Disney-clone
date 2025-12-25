# 🎬 Disney Clone - Dynamic Video Library

Your Disney Clone app now automatically detects and displays videos from the `public/video/` folder!

## 📁 How to Add New Movies

### Step 1: Add Video Files
Place your MP4 video files in the `public/video/` folder:
```
/your-project/
  public/
    video/
      your-movie.mp4
      another-movie.mp4
```

### Step 2: Update the Video Manifest
Run this command in your terminal:
```bash
npm run scan-videos
```

This will:
- Scan the `public/video/` folder
- Find all MP4 files
- Generate/update `public/video-manifest.json`
- Display file information and sizes

### Step 3: Refresh the App
The app will automatically detect new videos, but you can also:
- Click the **"Refresh Video Library"** button on the home page
- Wait 2 minutes (auto-refresh interval)
- Refresh the browser page

## 🎯 Supported Formats

- ✅ **MP4 files only** (for best compatibility across devices)
- ❌ MKV, AVI, MOV, etc. are not supported

## 🔄 Automatic Features

- **Auto-refresh**: Videos are checked every 2 minutes
- **Manual refresh**: Click the refresh button anytime
- **Smart detection**: Only shows videos not already in your MoviesData.json
- **Cache optimization**: Reduces server requests for better performance

## 📊 Current Video Library

Your app currently has these videos:
- Dhurandhar.mp4 (4.0 GB)
- Jolly.LLB-3.2025.mp4 (1.4 GB)

## 🛠️ Troubleshooting

### Videos not showing up?
1. Make sure files are in `public/video/` folder
2. Run `npm run scan-videos`
3. Click "Refresh Video Library" button
4. Check browser console for errors

### Video not playing?
1. Ensure it's MP4 format
2. Check file isn't corrupted
3. Try a different browser
4. Clear browser cache

### Want to convert videos?
```bash
# Convert MKV to MP4 (requires ffmpeg)
ffmpeg -i input.mkv -c:v libx264 -c:a aac output.mp4
```

## 🚀 Quick Start

1. Add your MP4 files to `public/video/`
2. Run: `npm run scan-videos`
3. Open: `http://localhost:3000`
4. Enjoy your movies! 🎥🍿

---

*Your Disney Clone app automatically handles the rest!*
