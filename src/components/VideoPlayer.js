import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

const VideoPlayer = ({ videoUrl, posterUrl, title, onClose }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);
  const [videoError, setVideoError] = useState(null);
  
  // Double tap detection
  const lastTapRef = useRef(0);
  const tapPositionRef = useRef({ x: 0, y: 0 });


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Clear any errors when video successfully loads
    const handleCanPlay = () => {
      setVideoError(null);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => setIsPlaying(false));
    video.addEventListener('canplay', handleCanPlay);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
      video.removeEventListener('canplay', handleCanPlay);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [videoUrl, videoError]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.currentTime + 10, duration);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Handle double tap for mobile
  const handleDoubleTap = (e) => {
    const currentTime = Date.now();
    const tapLength = currentTime - lastTapRef.current;
    const container = containerRef.current;
    
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0]?.clientX) || tapPositionRef.current.x;
    const y = e.clientY || (e.touches && e.touches[0]?.clientY) || tapPositionRef.current.y;
    
    tapPositionRef.current = { x, y };
    
    // Check if it's a double tap (within 300ms)
    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
      e.stopPropagation();
      
      // Determine if tap is on left or right side
      const containerWidth = rect.width;
      const tapX = x - rect.left;
      const isLeftSide = tapX < containerWidth / 2;
      
      if (isLeftSide) {
        skipBackward();
        showSkipIndicator('backward');
      } else {
        skipForward();
        showSkipIndicator('forward');
      }
      
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = currentTime;
    }
  };

  const [skipIndicator, setSkipIndicator] = useState(null);
  
  const showSkipIndicator = (direction) => {
    setSkipIndicator(direction);
    setTimeout(() => setSkipIndicator(null), 1000);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVideoType = (url) => {
    if (!url) return 'video/mp4';
    const extension = url.toLowerCase().split('.').pop();
    const typeMap = {
      'mp4': 'video/mp4',
      'mkv': 'video/x-matroska',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo'
    };
    return typeMap[extension] || 'video/mp4';
  };

  // Removed MKV format check since we only use MP4 files now

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Don't preemptively block - let the video try to play first
  // Only show errors when video actually fails to load/play
  useEffect(() => {
    // Reset error when video URL changes - give it a chance to play
    setVideoError(null);
  }, [videoUrl]);

  if (!videoUrl) {
    return null;
  }

  // Only MP4 files are supported now

  return (
    <VideoPlayerContainer 
      ref={containerRef}
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleDoubleTap}
      onClick={handleDoubleTap}
    >
      {videoError && (
        <ErrorMessage>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>{videoError}</ErrorText>
          <ErrorSolution>
            <p>If the video still doesn't play:</p>
            <ol>
              <li>Ensure the video file is in MP4 format</li>
              <li>Check that the file path is correct</li>
              <li>Try a different browser</li>
              <li>Clear browser cache</li>
            </ol>
          </ErrorSolution>
          <CloseButton onClick={() => {
            setVideoError(null);
            onClose();
          }} style={{marginTop: '20px', background: '#0063e5', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}}>Close</CloseButton>
        </ErrorMessage>
      )}
      {skipIndicator && (
        <SkipIndicator direction={skipIndicator}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            {skipIndicator === 'forward' ? (
              <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
            ) : (
              <path d="M11 18V6l-8.5 6L11 18zm.5-6l8.5 6V6l-8.5 6z"/>
            )}
          </svg>
          {skipIndicator === 'forward' ? '+10' : '-10'}
        </SkipIndicator>
      )}
      <Video
        ref={videoRef}
        poster={posterUrl}
        controls={false}
        preload="auto"
        playsInline={true}
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="portrait"
        onClick={(e) => {
          // Only toggle play on single click, not double tap
          if (Date.now() - lastTapRef.current > 300) {
            togglePlay();
          }
        }}
        onError={(e) => {
          console.error('Video error:', e);
          console.error('Video URL:', videoUrl);
          console.error('Video element:', videoRef.current);
          if (videoRef.current) {
            const error = videoRef.current.error;
            console.error('Error code:', error?.code);
            console.error('Error message:', error?.message);

            // Set error message for user only if video actually fails
            if (error) {
              console.log('VideoPlayer: Video error - code:', error.code, 'message:', error.message);

              // Error code 4 = MEDIA_ERR_SRC_NOT_SUPPORTED
              if (error.code === 4) {
                setVideoError('Video format not supported on this device. Please ensure the video is in MP4 format.');
              } else {
                setVideoError('Unable to play video. Error code: ' + error.code + '. Please try a different browser.');
              }
            }
          }
        }}
        onLoadStart={() => {
          console.log('Video load started:', videoUrl);
        }}
        onCanPlay={() => {
          console.log('Video can play:', videoUrl);
        }}
        onLoadedData={() => {
          console.log('Video data loaded:', videoUrl);
        }}
      >
        <source src={videoUrl} type={getVideoType(videoUrl)} />
        <source src={videoUrl} />
        Your browser does not support the video tag.
      </Video>

      <ControlsContainer show={showControls}>
        <ProgressBarContainer>
          <ProgressBar
            value={duration ? (currentTime / duration) * 100 : 0}
            max="100"
            onClick={handleSeek}
          />
        </ProgressBarContainer>

        <Controls>
          <LeftControls>
            <SkipButton onClick={skipBackward} title="Skip backward 10 seconds">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                <path d="M10 8H8v4h2V8z"/>
              </svg>
            </SkipButton>
            <PlayButton onClick={togglePlay}>
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </PlayButton>
            <SkipButton onClick={skipForward} title="Skip forward 10 seconds">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 5V1L9 6l-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6H8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4z"/>
                <path d="M14 8h2v4h-2V8z"/>
              </svg>
            </SkipButton>
            <TimeDisplay>
              {formatTime(currentTime)} / {formatTime(duration)}
            </TimeDisplay>
          </LeftControls>

          <RightControls>
            <VolumeContainer>
              <VolumeButton onClick={toggleMute}>
                {isMuted || volume === 0 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : volume < 0.5 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM12 4L9.91 6.09 12 8.18V4z"/>
                    <path d="M4.34 2.93L2.93 4.34 7.29 8.7 7 9H3v6h4l5 5v-6.73l4.29 4.29 4.34-4.34L4.34 2.93z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </VolumeButton>
              <VolumeSlider
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
              />
            </VolumeContainer>

            <FullscreenButton onClick={toggleFullscreen}>
              {isFullscreen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              )}
            </FullscreenButton>

            <CloseButton onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </CloseButton>
          </RightControls>
        </Controls>
      </ControlsContainer>
    </VideoPlayerContainer>
  );
};

const VideoPlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
`;

const SkipIndicator = styled.div`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'forward' ? 'right: 20%;' : 'left: 20%;'}
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  z-index: 10000;
  pointer-events: none;
  animation: fadeInOut 0.8s ease-out;
  display: flex;
  align-items: center;
  gap: 8px;

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-50%) scale(0.9); }
    50% { opacity: 1; transform: translateY(-50%) scale(1.05); }
    100% { opacity: 0; transform: translateY(-50%) scale(0.9); }
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
`;

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  padding: 16px 24px;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const ProgressBarContainer = styled.div`
  margin-bottom: 10px;
`;

const ProgressBar = styled.progress`
  width: 100%;
  height: 4px;
  cursor: pointer;
  appearance: none;
  border-radius: 2px;

  &::-webkit-progress-bar {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }

  &::-webkit-progress-value {
    background: #ff0000;
    border-radius: 2px;
  }

  &::-moz-progress-bar {
    background: #ff0000;
    border-radius: 2px;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
    justify-content: center;
    width: 100%;
  }
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 6px;
    justify-content: center;
    width: 100%;
  }
`;

const SkipButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 14px;
    padding: 6px;
  }
`;

const PlayButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 56px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px 14px;
    min-width: 48px;
  }
`;

const TimeDisplay = styled.span`
  color: white;
  font-size: 13px;
  font-weight: 500;
  margin-left: 16px;
  user-select: none;

  @media (max-width: 768px) {
    font-size: 12px;
    margin-left: 12px;
  }
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const VolumeButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 6px;
  }
`;

const VolumeSlider = styled.input`
  width: 70px;
  height: 4px;
  cursor: pointer;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
  }

  @media (max-width: 768px) {
    width: 50px;
  }
`;

const FullscreenButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 6px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  margin-left: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 6px;
    margin-left: 12px;
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 90%;
  text-align: center;
  z-index: 10001;
  border: 2px solid #ff4444;

  @media (max-width: 768px) {
    padding: 20px;
    max-width: 95%;
  }
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
`;

const ErrorText = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ErrorSolution = styled.div`
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;

  p {
    margin-bottom: 10px;
    font-weight: bold;
  }

  ol {
    margin-left: 20px;
    line-height: 1.8;
  }

  code {
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 10px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 12px;
    display: block;
    margin-top: 5px;
    word-break: break-all;
  }
`;

export default VideoPlayer;
