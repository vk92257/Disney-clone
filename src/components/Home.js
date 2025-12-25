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
import { getVideoFiles, generateMovieFromVideo } from '../utils/videoScanner';

const Home = (props)=>{
    const dispatch = useDispatch();
    const [autoVideos, setAutoVideos] = useState([]);

    useEffect(()=>{
        // Automatically load videos from video folder (only if not in JSON)
        const loadAutoVideos = async () => {
            try {
                const videoFiles = await getVideoFiles();
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
            } catch (error) {
                console.error('Error loading auto videos:', error);
            }
        };
        
        loadAutoVideos();
    }, []);

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
          <Viewrs/> 
          <Recomanded/>
          <NewDisney/>
          <Orignals/>
          <Trending/>
    </Container>
);
}
export default Home ;
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