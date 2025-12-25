/**
 * Script to extract a thumbnail frame from a video file
 * Requires: ffmpeg to be installed on your system
 * 
 * Usage: node scripts/extract-video-thumbnail.js <video-file> <output-image> [time-in-seconds]
 * Example: node scripts/extract-video-thumbnail.js public/video/movie.mp4 public/images/poster.jpg 5
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const videoFile = process.argv[2];
const outputImage = process.argv[3];
const time = process.argv[4] || '1'; // Default to 1 second

if (!videoFile || !outputImage) {
  console.error('Usage: node extract-video-thumbnail.js <video-file> <output-image> [time-in-seconds]');
  console.error('Example: node extract-video-thumbnail.js public/video/movie.mp4 public/images/poster.jpg 5');
  process.exit(1);
}

if (!fs.existsSync(videoFile)) {
  console.error(`Error: Video file not found: ${videoFile}`);
  process.exit(1);
}

// Ensure output directory exists
const outputDir = path.dirname(outputImage);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

try {
  // Check if ffmpeg is available
  execSync('ffmpeg -version', { stdio: 'ignore' });
  
  console.log(`Extracting thumbnail from ${videoFile} at ${time} seconds...`);
  
  // Extract thumbnail using ffmpeg
  execSync(
    `ffmpeg -i "${videoFile}" -ss ${time} -vframes 1 -q:v 2 "${outputImage}"`,
    { stdio: 'inherit' }
  );
  
  console.log(`✅ Thumbnail saved to: ${outputImage}`);
  
  // Also create a card-sized version (400x600)
  const cardImage = outputImage.replace('.jpg', '-card.jpg').replace('.png', '-card.png');
  execSync(
    `ffmpeg -i "${outputImage}" -vf "scale=400:600:force_original_aspect_ratio=decrease,pad=400:600:(ow-iw)/2:(oh-ih)/2" "${cardImage}"`,
    { stdio: 'inherit' }
  );
  console.log(`✅ Card thumbnail saved to: ${cardImage}`);
  
  // Create background version (1920x1080)
  const bgImage = outputImage.replace('.jpg', '-bg.jpg').replace('.png', '-bg.png');
  execSync(
    `ffmpeg -i "${outputImage}" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" "${bgImage}"`,
    { stdio: 'inherit' }
  );
  console.log(`✅ Background thumbnail saved to: ${bgImage}`);
  
} catch (error) {
  if (error.message.includes('ffmpeg')) {
    console.error('❌ Error: ffmpeg is not installed or not in PATH');
    console.error('Install ffmpeg:');
    console.error('  macOS: brew install ffmpeg');
    console.error('  Windows: Download from https://ffmpeg.org/download.html');
    console.error('  Linux: sudo apt-get install ffmpeg');
  } else {
    console.error('❌ Error extracting thumbnail:', error.message);
  }
  process.exit(1);
}

