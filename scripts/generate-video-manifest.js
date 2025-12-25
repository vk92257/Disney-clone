/**
 * Node.js script to automatically scan the public/video folder
 * and generate a video-manifest.json file
 * 
 * Run this script with: node scripts/generate-video-manifest.js
 */

const fs = require('fs');
const path = require('path');

const VIDEO_DIR = path.join(__dirname, '../public/video');
const MANIFEST_PATH = path.join(__dirname, '../public/video-manifest.json');

const VIDEO_EXTENSIONS = ['.mp4', '.mkv', '.webm', '.ogg', '.mov', '.avi'];

function isVideoFile(filename) {
  const lowerFilename = filename.toLowerCase();
  return VIDEO_EXTENSIONS.some(ext => lowerFilename.endsWith(ext));
}

function scanVideoFolder() {
  try {
    const files = fs.readdirSync(VIDEO_DIR);
    const videoFiles = files.filter(isVideoFile);
    
    const manifest = {
      videos: videoFiles,
      lastUpdated: new Date().toISOString()
    };

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`✅ Generated manifest with ${videoFiles.length} videos:`);
    videoFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    console.log(`\n📁 Manifest saved to: ${MANIFEST_PATH}`);
  } catch (error) {
    console.error('❌ Error scanning video folder:', error.message);
    process.exit(1);
  }
}

scanVideoFolder();

