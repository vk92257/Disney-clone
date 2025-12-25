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

const VIDEO_EXTENSIONS = ['.mp4']; // Only MP4 files are supported

function isVideoFile(filename) {
  const lowerFilename = filename.toLowerCase();
  // Only accept MP4 files now
  return lowerFilename.endsWith('.mp4');
}

function scanVideoFolder() {
  try {
    // Check if video directory exists
    if (!fs.existsSync(VIDEO_DIR)) {
      console.log('📁 Creating video directory...');
      fs.mkdirSync(VIDEO_DIR, { recursive: true });
    }

    const files = fs.readdirSync(VIDEO_DIR);
    const videoFiles = files.filter(isVideoFile);

    const manifest = {
      videos: videoFiles,
      lastUpdated: new Date().toISOString(),
      totalFiles: videoFiles.length
    };

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

    console.log(`🎬 Video Library Scanner`);
    console.log(`═══════════════════════════════`);
    console.log(`📁 Scanning: ${VIDEO_DIR}`);
    console.log(`✅ Found ${videoFiles.length} MP4 video files:`);

    if (videoFiles.length > 0) {
      videoFiles.forEach((file, index) => {
        const stats = fs.statSync(path.join(VIDEO_DIR, file));
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`   ${index + 1}. ${file} (${sizeMB} MB)`);
      });
    } else {
      console.log(`   No MP4 files found. Add some videos to get started!`);
      console.log(`   📖 Tip: Place your .mp4 files in the public/video/ folder`);
    }

    console.log(`\n💾 Manifest saved to: ${MANIFEST_PATH}`);
    console.log(`🔄 Last updated: ${new Date().toLocaleString()}`);
    console.log(`\n🚀 Your Disney Clone app will automatically detect these videos!`);
    console.log(`   Visit http://localhost:3000 to see them in action.`);

  } catch (error) {
    console.error('❌ Error scanning video folder:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   • Make sure the public/video/ folder exists');
    console.error('   • Check file permissions');
    console.error('   • Ensure video files are in MP4 format');
    process.exit(1);
  }
}

scanVideoFolder();

