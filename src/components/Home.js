import styled from 'styled-components';
import SliderImage from './SliderImage';

import Viewrs from './../components/Viewrs';
import Recomanded from './Recomanded';
import NewDisney from './NewDisney';
import Orignals from './Orignals';
import Trending from './Trending';
import {useEffect, useState} from "react";
import {useDispatch} from 'react-redux';
// import db from '../Firebase'
import{ setMovie } from '../features/movie/movieSlice';
// import{selectUserName} from '../features/user/userSlice';
import movieData from '../MoviesData.json';
import { getVideoFiles, generateMovieFromVideo, refreshVideoFiles } from '../utils/videoScanner';

const Home = (props)=>{
    const dispatch = useDispatch();
    const [autoVideos, setAutoVideos] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(null);

    // Function to load auto-detected videos
    const loadAutoVideos = async (forceRefresh = false) => {
        try {
            const videoFiles = forceRefresh ? await refreshVideoFiles() : await getVideoFiles();
            const movies = movieData.movies;

            // Get all video URLs from JSON
            const existingVideoUrls = new Set();
            Object.keys(movies).forEach(key => {
                const movie = movies[key];
                if (movie.videoUrl) {
                    existingVideoUrls.add(movie.videoUrl);
                }
            });

            // Only generate movies for videos not in JSON
            const autoMovies = videoFiles
                .map((filename, index) => {
                    const videoUrl = `/video/${filename}`;
                    if (!existingVideoUrls.has(videoUrl)) {
                        return generateMovieFromVideo(filename, index);
                    }
                    return null;
                })
                .filter(movie => movie !== null);

            setAutoVideos(autoMovies);
            setLastRefresh(new Date());

            if (forceRefresh) {
                console.log(`Refreshed video list: found ${videoFiles.length} total videos, ${autoMovies.length} new auto-detected movies`);
            }
        } catch (error) {
            console.error('Error loading auto videos:', error);
        }
    };

    // Auto-refresh videos every 2 minutes
    useEffect(() => {
        loadAutoVideos();

        const interval = setInterval(() => {
            loadAutoVideos(true);
        }, 120000); // 2 minutes

        return () => clearInterval(interval);
    }, []);

    // Manual refresh function
    const handleRefreshVideos = async () => {
        setIsRefreshing(true);
        try {
            await loadAutoVideos(true);
        } catch (error) {
            console.error('Error refreshing videos:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(()=>{
        // Local data loading instead of Firebase
        const movies = movieData.movies;
        let recommanded = [];
        let newDisney = [];
        let orignals = [];
        let trending = [];

        // Get all video URLs from JSON to avoid duplicates
        const existingVideoUrls = new Set();
        Object.keys(movies).forEach(key => {
            const movie = movies[key];
            if (movie.videoUrl) {
                existingVideoUrls.add(movie.videoUrl);
            }
        });

        // Load from JSON data
        Object.keys(movies).forEach(key => {
            const movie = movies[key];
            switch(movie.type){
                case 'recommend':
                    recommanded = [...recommanded , {id: key, ...movie}];
                     break;
                case 'new':
                    newDisney = [...newDisney , {id: key, ...movie}];
                    break;
                case 'original':
                    orignals = [...orignals , {id: key, ...movie}];
                break;
                case 'trending':
                    trending = [...trending , {id: key, ...movie}];
                break;
                default:
                    break;
            }
        });

        // Add auto-detected videos to "new" section ONLY if they don't already exist in JSON
        if (autoVideos.length > 0) {
            const uniqueAutoVideos = autoVideos.filter(autoMovie =>
                !existingVideoUrls.has(autoMovie.videoUrl)
            );
            newDisney = [...newDisney, ...uniqueAutoVideos];
        }

        dispatch(setMovie({
            recommanded: recommanded,
            newDisney: newDisney,
            orignals: orignals,
            trending:trending,
        })
        );
    }, [dispatch, autoVideos]);
 
return(
    <Container>

          <SliderImage/>
          <RefreshSection>
              <div>
                  <RefreshButton onClick={handleRefreshVideos} disabled={isRefreshing}>
                      {isRefreshing ? (
                          <>
                              <LoadingSpinner />
                              Refreshing Videos...
                          </>
                      ) : (
                          <>
                              <RefreshIcon />
                              Refresh Video Library
                          </>
                      )}
                  </RefreshButton>
                  <RefreshInfo>
                      Auto-refreshes every 2 minutes. Click to manually refresh after adding new videos.
                  </RefreshInfo>
              </div>
              <div>
                  {lastRefresh && (
                      <LastRefresh>
                          Last updated: {lastRefresh.toLocaleTimeString()}
                      </LastRefresh>
                  )}
                  <AddVideoInfo>
                      To add new videos: Place MP4 files in <code>public/video/</code> folder and run <code>npm run scan-videos</code>
                  </AddVideoInfo>
              </div>
          </RefreshSection>
          <Viewrs/>
          <Recomanded/>
          <NewDisney/>
          <Orignals/>
          <Trending/>
    </Container>
);
}
export default Home ;

const RefreshSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
    padding: 15px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 10px;
        margin: 15px 0;
        padding: 10px;
    }
`;

const RefreshButton = styled.button`
    background: #ff0000;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
        background: #cc0000;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }

    @media (max-width: 768px) {
        padding: 10px 20px;
        font-size: 14px;
    }
`;

const RefreshIcon = styled.span`
    font-size: 18px;
    animation: spin 2s linear infinite;

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

const LoadingSpinner = styled.div`
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
`;

const LastRefresh = styled.span`
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: 400;

    @media (max-width: 768px) {
        font-size: 12px;
        text-align: center;
    }
`;

const RefreshInfo = styled.p`
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    margin: 8px 0 0 0;
    line-height: 1.4;
    max-width: 300px;

    @media (max-width: 768px) {
        font-size: 11px;
        text-align: center;
        max-width: 280px;
    }
`;

const AddVideoInfo = styled.p`
    color: rgba(255, 255, 255, 0.6);
    font-size: 11px;
    margin: 8px 0 0 0;
    line-height: 1.4;
    max-width: 400px;

    code {
        background: rgba(0, 0, 0, 0.5);
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 10px;
        color: #ffcc00;
    }

    @media (max-width: 768px) {
        font-size: 10px;
        text-align: center;
        max-width: 280px;
    }
`;

const Container = styled.main`
position:relative;
min-height:calc(100vh - 250px);
overflow-x: hidden;
display: block;
top:70px;

padding: 0 calc(3.5vh+5px);

@media (max-width: 768px) {
    top: 60px;
    padding: 0 10px;
    min-height: calc(100vh - 200px);
}

&::after{
background: url("/images/home-background.png") center center/ 
cover no-repeat fixed ;
content: '';
position: absolute;
inset:0px;
opacity: 1;
z-index: -1;
}

`;