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
  const [isMobile, setIsMobile] = useState(false);
  
  // Double tap detection
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);
  const tapPositionRef = useRef({ x: 0, y: 0 });

  // Detect mobile device (specifically iOS which doesn't support MKV)
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const userAgentLower = userAgent.toLowerCase();
      // Only flag iOS as problematic for MKV, Android might support it
      const isIOS = /iphone|ipad|ipod/i.test(userAgentLower);
      const isAndroid = /android/i.test(userAgentLower);
      // Set mobile flag for UI purposes, but only block MKV on iOS
      setIsMobile(isIOS || isAndroid);
    };
    checkMobile();
  }, []);

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
      console.log('Video can play:', videoUrl);
      // Clear any errors if video can play
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
    video.currentTime = Math.min(video.currentTime + 3, duration);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(video.currentTime - 3, 0);
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

  const isMKVFormat = (url) => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.mkv');
  };

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
    console.log('VideoPlayer: No videoUrl provided');
    return null;
  }

  console.log('VideoPlayer: Rendering with videoUrl:', videoUrl);

  // Check if video format is MKV
  const isMKV = isMKVFormat(videoUrl);

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
          {isMKV && (
            <ErrorSolution>
              <p>To fix this:</p>
              <ol>
                <li>Convert your MKV file to MP4 format</li>
                <li>Use: <code>ffmpeg -i input.mkv -c:v libx264 -c:a aac output.mp4</code></li>
                <li>Or run: <code>npm run convert-mkv</code></li>
                <li>Update the video URL in MoviesData.json</li>
              </ol>
            </ErrorSolution>
          )}
          <CloseButton onClick={() => {
            setVideoError(null);
            onClose();
          }} style={{marginTop: '20px', background: '#0063e5', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}}>Close</CloseButton>
        </ErrorMessage>
      )}
      {skipIndicator && (
        <SkipIndicator direction={skipIndicator}>
          {skipIndicator === 'forward' ? '⏩ +3s' : '⏪ -3s'}
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
              const userAgent = navigator.userAgent || navigator.vendor || window.opera;
              const isIOS = /iphone|ipad|ipod/i.test(userAgent.toLowerCase());
              const isAndroid = /android/i.test(userAgent.toLowerCase());
              const isMKV = isMKVFormat(videoUrl);
              
              // Error code 4 = MEDIA_ERR_SRC_NOT_SUPPORTED
              if (error.code === 4) {
                if (isMKV && isIOS) {
                  setVideoError('MKV format is not supported on iOS. Please convert to MP4 format.');
                } else if (isMKV && isAndroid) {
                  setVideoError('MKV format may not be supported on this Android browser. Try converting to MP4 format.');
                } else {
                  setVideoError('Video format not supported on this device. Please convert to MP4 format.');
                }
              } else {
                setVideoError('Unable to play video. Error code: ' + error.code + '. Please try a different browser or convert to MP4.');
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
            <SkipButton onClick={skipBackward} title="Skip backward 3 seconds">
              ⏪
            </SkipButton>
            <PlayButton onClick={togglePlay}>
              {isPlaying ? '⏸️' : '▶️'}
            </PlayButton>
            <SkipButton onClick={skipForward} title="Skip forward 3 seconds">
              ⏩
            </SkipButton>
            <TimeDisplay>
              {formatTime(currentTime)} / {formatTime(duration)}
            </TimeDisplay>
          </LeftControls>

          <RightControls>
            <VolumeContainer>
              <VolumeButton onClick={toggleMute}>
                {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
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
              {isFullscreen ? '🗗' : '🗖'}
            </FullscreenButton>

            <CloseButton onClick={onClose}>
              ✕
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
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px 40px;
  border-radius: 10px;
  font-size: 24px;
  font-weight: bold;
  z-index: 10000;
  pointer-events: none;
  animation: fadeInOut 1s ease-in-out;
  
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-50%) scale(0.8); }
    50% { opacity: 1; transform: translateY(-50%) scale(1.1); }
    100% { opacity: 0; transform: translateY(-50%) scale(0.8); }
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
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: ${props => props.show ? 'auto' : 'none'};

  @media (max-width: 768px) {
    padding: 15px 10px;
  }
`;

const ProgressBarContainer = styled.div`
  margin-bottom: 10px;
`;

const ProgressBar = styled.progress`
  width: 100%;
  height: 6px;
  cursor: pointer;
  appearance: none;

  &::-webkit-progress-bar {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  &::-webkit-progress-value {
    background: #0063e5;
    border-radius: 3px;
  }

  &::-moz-progress-bar {
    background: #0063e5;
    border-radius: 3px;
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
  gap: 15px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
    justify-content: center;
    width: 100%;
  }
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
    justify-content: center;
    width: 100%;
  }
`;

const SkipButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 10px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.6);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 18px;
    padding: 8px;
  }
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;

  &:hover {
    opacity: 0.8;
  }
`;

const TimeDisplay = styled.span`
  color: white;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
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
  padding: 5px;

  &:hover {
    opacity: 0.8;
  }
`;

const VolumeSlider = styled.input`
  width: 80px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 60px;
  }
`;

const FullscreenButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;

  &:hover {
    opacity: 0.8;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;

  &:hover {
    opacity: 0.8;
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
