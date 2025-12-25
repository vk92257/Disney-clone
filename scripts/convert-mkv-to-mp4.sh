#!/bin/bash

# Script to convert MKV files to MP4 for mobile compatibility
# Usage: ./scripts/convert-mkv-to-mp4.sh [input-file] [output-file]

INPUT_FILE="${1:-public/video/Jolly.LLB-3.2025.720p.DS4K.Hindi.WEB-DL.5.1.ESub.x264-HDHub4u.Ms.mkv}"
OUTPUT_FILE="${2:-public/video/Jolly-LLB-3.mp4}"

echo "Converting MKV to MP4 for mobile compatibility..."
echo "Input: $INPUT_FILE"
echo "Output: $OUTPUT_FILE"

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file not found: $INPUT_FILE"
    exit 1
fi

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed"
    echo "Install it with:"
    echo "  macOS: brew install ffmpeg"
    echo "  Linux: sudo apt-get install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

# Convert MKV to MP4 with H.264 codec (mobile compatible)
ffmpeg -i "$INPUT_FILE" \
    -c:v libx264 \
    -preset medium \
    -crf 23 \
    -c:a aac \
    -b:a 192k \
    -movflags +faststart \
    "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Conversion successful!"
    echo "📁 Output file: $OUTPUT_FILE"
    echo ""
    echo "Next steps:"
    echo "1. Update MoviesData.json with the new video URL:"
    echo "   \"videoUrl\": \"/video/Jolly-LLB-3.mp4\""
    echo "2. Restart your app"
else
    echo "❌ Conversion failed"
    exit 1
fi

