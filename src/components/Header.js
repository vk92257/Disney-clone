import styled from 'styled-components';
import {useEffect} from 'react';
import {auth,provider} from '../Firebase';
import {useDispatch , useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import{selectUserName, selectUserPhoto,setSignOutState,setUserLoginDetails} from '../features/user/userSlice';
const Header = (props)=>{
    const dispatch = useDispatch();
    const history = useHistory();
    const userName = useSelector(selectUserName);
    const userPhoto = useSelector(selectUserPhoto);

  useEffect(()=>{
      auth.onAuthStateChanged(async user=>{
            if(user){
                setUser(user);
                history.push('/home')
            }
      })
  },[userName]);
  
  
    const handelAuth = ()=>{
       if(!userName){ auth.signInWithPopup(provider).then(result=>{
                setUser(result.user);
        }).catch(err=>{
             alert(err.message);
        })}
        else if(userName){
           auth.signOut().then(()=>{
            dispatch(setSignOutState);
            history.push("/"); 
           }).catch(err => alert(err.message))       }
    }

    const setUser = user=>{
        dispatch(setUserLoginDetails({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
        }));
    }

return (
    <Nav> 
        <Logo>
            <img src="/images/logo.svg" alt=""/>
        </Logo>
        {!userName ?( <Login  onClick ={handelAuth} >Login</Login> ) : (<> 
        <Menuitem>
        <a href="/home">
            <img src="/images/home-icon.svg" alt="HOME"/>
            <span>HOME</span>
        </a>
        <a href="/home">
            <img src="/images/search-icon.svg" alt="HOME"/>
            <span>SEARCH</span>
        </a>
        <a href="/home">
            <img src="/images/watchlist-icon.svg" alt="HOME"/>
            <span>WATCHLIST</span>
        </a>
        <a href="/home">
            <img src="/images/original-icon.svg" alt="HOME"/>
            <span>ORIGINALS</span>
        </a>
        <a href="/home">
            <img src="/images/movie-icon.svg" alt="HOME"/>
            <span>MOVIES</span>
        </a>
        <a href="/home">
            <img src="/images/series-icon.svg" alt="HOME"/>
            <span>SERIES</span>
        </a>

        </Menuitem>
       
       <SignOut>
       <UserImage src = {userPhoto} alt={userName}></UserImage>
       <DropDown> 
           <span onClick={handelAuth}>Sign Out</span>
       </DropDown>
       </SignOut>
       
        </>)}
        {/* <Login  onClick ={handelAuth} >Login</Login> */}
    </Nav>
);
}
export default Header;

const Nav = styled.nav`
    position:fixed; 
    top:0;
    left:0;
    right:0;
    display:flex;
    flex-direction:row;
    justify-content : space-between;
    align-items:center;
    padding:0 36px;
    letter-spacing:15px;
    height:70px;
    z-index:999;
    background-color:#090b13;
`;

const Logo = styled.a`
padding:0;
display: inline-block;
max-width:70px;
width:80px;
img {
width:100%;
display:flex;
}
`;

const Menuitem = styled.div`
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    margin: 0;
    padding : 0;
    position: relative;
    margin-left:25px;
    margin-right:auto;

a{
    margin-left:12px;
    display: flex;
    align-items:center;
    padding:0.12px;
    
    img{
        align-items:center;
        width:20px;
        min-width:20px;
        height:20px;
        z-index:auto;
    }
    span{
        align-items:center;
        font-size:13px;
        letter-spacing:1.45px;
        line-height:1.08;
        margin-left:3px;
        padding:2px 0px;
        position: relative;
        

    }
    span:before{
        background-color: rgb(249,249,249);
        display:block;
        border-radius: 0px 0px 4px 4px;
        bottom : -6px;
        content:'';
        left: 0px;
        opacity: 1;
        position: absolute;
        right: 0px;
        /* transform-origin:left center; */
        /* transform: scalex(0); */
        transition:all 250ms cubic-bezier(0.25 , 0.46,0.45,0.94)0s;
/* visibility:hidden; */
width:0;
height:2px;
    }
    &:hover{
     span:before{
         /* transform:scalex(1);
         opacity: 1 inherit;
         visibility: visible; */
         width:100%;

     }
}
 
   }


    @media (max-width:788px){
        display: none;
    }
`;

const Login = styled.a`
    background-color : rgba(0,0,0,0,0.6);
    padding:8px 16px;
    letter-spacing: 1.4px;
    border: 0.5px solid #f9f9f9;
    border-radius:4px;
    transition: all 0.2s ease 0s;

    &:hover{
    background-color:#f9f9f9;
    color:black;
    border-color: transparent;
    
};
`;

const UserImage = styled.img`
height:100%;
`;


const DropDown = styled.div`
position:absolute;
font-size:14px;
cursor: pointer;
letter-spacing: 3px;
top:40px;
right: 8px;
opacity:0;
width:100%;
background: rgb(19,19,19);
`;

const SignOut = styled.div`
position: relative;
display:flex;
width:48px;
height:48px;
justify-content:center;
align-items: center;
${UserImage}{
    border-radius:50px;
    width:100%;
    height:100%;
}

&:hover{
    ${DropDown}{
        opacity:1;
        transition-duration: 1s;
    }
}

`;