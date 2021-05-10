import styled from 'styled-components';
import SliderImage from './SliderImage';

import Viewrs from './../components/Viewrs';
import Recomanded from './Recomanded';
import NewDisney from './NewDisney';
import Orignals from './Orignals';
import Trending from './Trending';
const Home = (props)=>{
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