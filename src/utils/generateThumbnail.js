/**
 * Utility to help generate thumbnails from video files
 * You can use this to extract frames from videos as thumbnails
 */

/**
 * Generate a thumbnail from a video file using canvas
 * @param {string} videoUrl - URL to the video file
 * @param {number} time - Time in seconds to capture the frame (default: 1)
 * @returns {Promise<string>} - Data URL of the thumbnail image
 */
export const generateThumbnailFromVideo = (videoUrl, time = 1) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.crossOrigin = 'anonymous';
    video.currentTime = time;
    video.src = videoUrl;

    video.addEventListener('loadeddata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnail);
    });

    video.addEventListener('error', (error) => {
      reject(error);
    });

    video.load();
  });
};

/**
 * Get video metadata including duration
 * @param {string} videoUrl - URL to the video file
 * @returns {Promise<Object>} - Video metadata
 */
export const getVideoMetadata = (videoUrl) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = videoUrl;

    video.addEventListener('loadedmetadata', () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
    });

    video.addEventListener('error', (error) => {
      reject(error);
    });

    video.load();
  });
};

