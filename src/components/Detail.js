import styled from 'styled-components';
import {useEffect , useState} from 'react';
import {useParams} from 'react-router-dom';
import db from '../Firebase';

const Detail = (props)=>{
    const {id } = useParams();
    const [detailDate , setDetailData] = useState({});

    useEffect(()=>{
        db.collection('movies').doc(id)
        .get()
        .then(doc=>{
                if(doc.exists){
                    setDetailData(doc.data())
                }else{
                    console.log('no such document in firebase');
                }
            }).catch( err => {
                console.log('Error getting document : ' , err);
            })
    },[id]);
    
    return(
        <Container>
          <BackGround>
              <img src={detailDate.backgroundImg}alt={detailDate.title}/>
          </BackGround>
          <ImagesTitel>
              <img src={detailDate.titleImg}alt={detailDate.title}/>
          </ImagesTitel>
            <ContentMeta>
                <Controll>
                   <Player>
                       <img src = '/images/play-icon-black.png' alt=''/>
                       <span> play </span>
                       </Player> 
                       <Trailer>
                           <img src = '/images/play-icon-white.png' alt=""/>
                            <span>trailer</span>
                       </Trailer>
                       <AddList>
                           <span/>
                           <span/>
                       </AddList>
                       <GroupWatch>
                           <img src='/images/group-icon.png' alt=''/>
                       </GroupWatch>
                </Controll>
                    <SubTitle>
                        {detailDate.subTitle}
                    </SubTitle>
                    <Description>
                        {detailDate.description}
                    </Description>
            </ContentMeta>
        </Container>

    )

}
const Container = styled.div`
margin : 24px;
display:block;
position: relative;
top:72px;
overflow-x: hidden;
min-height:calc(100vh-250px);
padding: 0 calc(3.5vw+5px);
`;
const BackGround = styled.div`
    left: 0px;
    opacity:0.8;
    position: fixed;
    right:0px;
    top:0px;
    z-index: -1;
    img{
        width: 100vw;
        height:100vh;
        @media (max-width:768px){
            width: initial;
        }
    }
`;
const ImagesTitel = styled.div`
       align-items: flex-end;
       display: flex;
       -webkit-box-pack: flex-start;
       justify-content: flex-start;
       margin: 70px auto;
       height:30vw;
       max-height: 170px;
       padding-bottom: 10px;
       width:100%;


img{
max-width:600px;
max-height:200px;
width: 100%;
}
`;

const ContentMeta = styled.div `
    max-width: 874px;

`;
const Controll = styled.div`
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    margin : 24px;
    min-height: 56px;
`;
const Player = styled.button`
    display: flex;
    align-items: center;
    margin: 0px 22px 0px 0px;
    justify-content:center;
    height:56px;
    font-size:15px;
    cursor: pointer;
    border-radius: 4px;
    padding:0px 24px;
    letter-spacing: 1.8;
    border: none;
    text-align: center;
    text-transform: uppercase;
    background:rgb(249 , 249 , 249);
        color : rgb(0 , 0 , 0);
    img{
        width: 32px;
    }
    &:hover{
        background:rgb(198 , 198 , 198)
    }
@media (max-width : 768px){
    height: 45px;
    padding: 0px 12px;
    font-size: 12px;
    margin: 0px 10px 0px 0px;

    img{
        width:25px;
    }
}

`;

const Trailer = styled(Player)`
    background: rgba(0,0,0,0.3);
    border: 1px solid rgb(249,249,249);
    color : rgb(249 , 249, 249);

`;
const AddList = styled.div`
margin-right:16px;
height:44px;
width: 44px;
display: flex;
justify-content: center;
align-items: center;
background-color: rgb(0,0,0,0.6);
border-radius:50%;
border : 2px solid white;
cursor: pointer;
span{
    background-color: rgb(249 , 249 , 249);
    display : inline-block;
   
    &:first-child{
        height: 2px;
        transform: translate(1px , 0px ) rotate( 0deg);
        width: 16px;
     }

     &:nth-child(2){
         height : 16px;
         transform: translateX(-8px ) rotate( 0deg);
         width: 2px;
     }
}
`;

const GroupWatch = styled(AddList)`

`;

const SubTitle = styled.div`
 color : rgb(249,249,249);
    font-size:15px;
    min-height:20px;
    @media (max-width: 768px){
        font-size:12px;
    }
`;
const Description = styled.div `
color : rgb(249,249,249);
    font-size:20px;
    line-height:1.4;
    padding:16px 0px;
    
    @media (max-width: 768px){
        font-size:14px;
    }
`;

export default Detail;