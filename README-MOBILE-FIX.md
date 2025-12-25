# Fix Video Playback on Mobile

## Problem
MKV video files don't play on mobile browsers (especially iOS Safari). The video works on laptop but not on phone.

## Solution: Convert MKV to MP4

### Quick Fix (Recommended)

Run the conversion script:

```bash
npm run convert-mkv
```

Or manually:

```bash
bash scripts/convert-mkv-to-mp4.sh
```

This will:
1. Convert your MKV file to MP4 format
2. Create a mobile-compatible video file
3. Show you the next steps

### Manual Conversion

If you have `ffmpeg` installed:

```bash
ffmpeg -i public/video/Jolly.LLB-3.2025.720p.DS4K.Hindi.WEB-DL.5.1.ESub.x264-HDHub4u.Ms.mkv \
  -c:v libx264 \
  -preset medium \
  -crf 23 \
  -c:a aac \
  -b:a 192k \
  -movflags +faststart \
  public/video/Jolly-LLB-3.mp4
```

### After Conversion

1. Update `src/MoviesData.json`:
   ```json
   "videoUrl": "/video/Jolly-LLB-3.mp4"
   ```

2. Restart your app:
   ```bash
   npm start
   ```

3. Test on your phone - the video should now play!

## Why This Happens

- **MKV format** is not natively supported by mobile browsers
- **MP4 with H.264** is the most compatible format for mobile devices
- iOS Safari requires MP4 format for video playback
- Android browsers also prefer MP4 for better compatibility

## Video Format Compatibility

| Format | Desktop | iOS | Android |
|--------|---------|-----|---------|
| MP4 (H.264) | ✅ | ✅ | ✅ |
| MKV | ✅ | ❌ | ⚠️ |
| WebM | ✅ | ❌ | ✅ |

**Recommendation**: Always use MP4 format for best mobile compatibility.

## Error Messages

If you see an error message on mobile:
- The app will automatically detect MKV files on mobile
- It will show a helpful error message with conversion instructions
- Follow the steps to convert your video

## Need Help?

1. Make sure `ffmpeg` is installed
2. Check that the video file exists in `public/video/`
3. Verify the file path in `MoviesData.json`
4. Clear browser cache and try again

