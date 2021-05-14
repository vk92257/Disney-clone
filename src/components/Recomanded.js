import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {useSelector}from 'react-redux';
import {selectRecommanded} from '../features/movie/movieSlice'

const Recomanded = (props)=>{
const movies = useSelector(selectRecommanded);
return(
    <Container>
        <h3>Recomanded for you </h3>
    <Content>
       
       {
           movies && movies.map((movie , key)=>(
             <Wrap key={key}>
            <Link to={"/detail" + movie.id} >

            <img src = {movie.cardImg} alt = {movie.title}/>

            </Link>
        </Wrap>

           ))
           }

        {/* <Wrap>
            <Link to="/" >

            <img src = "https://pyxis.nymag.com/v1/imgs/e70/f36/f9ce2d68928e3e538e8776f69c8afe6852-10-minions.2x.rhorizontal.w710.jpg" alt = ""/>

            </Link>
        </Wrap>

        <Wrap>
            <Link to="/" >

            <img src = "https://pyxis.nymag.com/v1/imgs/e70/f36/f9ce2d68928e3e538e8776f69c8afe6852-10-minions.2x.rhorizontal.w710.jpg" alt = ""/>
                    
            </Link>
        </Wrap>

        <Wrap>
            <Link to="/" >

            <img src = "https://pyxis.nymag.com/v1/imgs/e70/f36/f9ce2d68928e3e538e8776f69c8afe6852-10-minions.2x.rhorizontal.w710.jpg" alt = ""/>
                   
            </Link>
        </Wrap>

        <Wrap> */}
            {/* <Link to="/" >

                    <img src = "https://pyxis.nymag.com/v1/imgs/e70/f36/f9ce2d68928e3e538e8776f69c8afe6852-10-minions.2x.rhorizontal.w710.jpg" alt = ""/>

            </Link>
        </Wrap> */}

    </Content>
    </Container>
);

}
const Container = styled.div`

padding :  25px;
`;
const Content = styled.div `
    display: grid;
    grid-gap: 25px;
    gap: 25px;
    grid-template-columns: repeat(4 , minmax(0,1fr));

    @media (max-width : 768px){
        grid-template-columns: repeat(2, minmax(0,1fr));
    }
`;

const Wrap = styled.div`

padding-top: 55%;
border-radius: 10px;
box-shadow:rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
    transform: scale(1.04); 
    /* border-color: 10px solid rgb(249, 249, 249,8.8); */
    border : 3px solid rgb(249 , 249, 249, 0.1);
cursor: pointer;
overflow:hidden;
transition : all 250ms cubic-bezier(0.25 , 0.46, 0.45, 0.96 ) 0s;


 img{
        inset: 0px;
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
        opacity: 1;
        transition: opacity 500 ms  ease-ease-in-out 0s;
        position:absolute;
        top:0;
        z-index:1;
        
 }

 &:hover{
    border-color: rgb(249, 249, 249,8.8);
            box-shadow:rgb(0 0 0 / 80%) 0px 40px 58px 
            -16px , rgb(0 0 0 / 73%) 0px 30px 22px -10px;
            transform:scale(1.05);     
        }
`;
export default Recomanded;
