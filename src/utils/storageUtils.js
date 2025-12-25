import { storage } from '../Firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload a video file to Firebase Storage
 * @param {File} file - The video file to upload
 * @param {string} movieId - The movie ID to use as folder name
 * @param {function} onProgress - Optional progress callback
 * @returns {Promise<string>} - Returns the download URL
 */
export const uploadVideo = async (file, movieId, onProgress = null) => {
  try {
    const videoRef = ref(storage, `movies/${movieId}/video/${file.name}`);

    const uploadTask = uploadBytes(videoRef, file);

    if (onProgress) {
      // You can implement progress tracking here if needed
      // uploadTask.on('state_changed', onProgress);
    }

    await uploadTask;
    const downloadURL = await getDownloadURL(videoRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

/**
 * Upload a poster/thumbnail image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} movieId - The movie ID to use as folder name
 * @param {string} type - Type of image (poster, background, card)
 * @returns {Promise<string>} - Returns the download URL
 */
export const uploadImage = async (file, movieId, type = 'poster') => {
  try {
    const imageRef = ref(storage, `movies/${movieId}/images/${type}/${file.name}`);
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} url - The download URL of the file to delete
 */
export const deleteFile = async (url) => {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Get video duration from a video file
 * @param {File} file - The video file
 * @returns {Promise<number>} - Duration in seconds
 */
export const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      resolve(video.duration);
    };

    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
};
