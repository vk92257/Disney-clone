import styled from 'styled-components';
import SliderImage from './SliderImage';

import Viewrs from './../components/Viewrs';
import Recomanded from './Recomanded';
import NewDisney from './NewDisney';
import Orignals from './Orignals';
import Trending from './Trending';
import {useEffect } from "react";
import {useDispatch,useSelector} from 'react-redux';
import db from '../Firebase'
import{ setMovie } from '../features/movie/movieSlice';
import{selectUserName} from '../features/user/userSlice';

const Home = (props)=>{
    let dispatch = useDispatch();
    let userName = useSelector(selectUserName);
    let recommanded = [];
    let newDisney = [];
    let orignals = [];
    let trending = [];

    useEffect(()=>{
        db.collection('movies').onSnapshot((snapshot)=>{
            // console.log(snapshot.docs);

        snapshot.docs.map(doc=>{
            // console.log(doc._delegate._document.data.partialValue.mapValue.fields.type);
            console.log(doc.data().type);
                switch(doc.data().type){
                    
                    case 'recommend':
                        // recommanded.push({id: doc.id, ...doc.data()})
                        recommanded = [...recommanded , {id: doc.id, ...doc.data()}];
                        console.log(recommanded);
                         break;
                    case 'new':
                        // newDisney.push({id: doc.id, ...doc.data()})
                        newDisney = [...newDisney , {id: doc.id, ...doc.data()}];
                        console.log(newDisney);
                        break;
                    case 'original':
                        orignals = [...orignals , {id: doc.id, ...doc.data()}];
                        console.log(orignals);
                        // orignals.push({id: doc.id, ...doc.data()})
                    break;
                    case 'trending':
                        trending = [...trending , {id: doc.id, ...doc.data()}];
                        console.log(trending);
                        // trending.push({id: doc.id, ...doc.data()})
                    break;
                    
                }
            });
        

        dispatch(setMovie({
            recommanded: recommanded,
            newDisney: newDisney,
            orignals: orignals,
            trending:trending,
        })
        );
    });
    
},[userName]);
 
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