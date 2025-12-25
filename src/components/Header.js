import styled from 'styled-components';
import {useState} from 'react';
// import {useEffect} from 'react';
// import {auth,provider} from '../Firebase';
import {useDispatch , useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import{selectUserName, selectUserPhoto,setSignOutState,setUserLoginDetails} from '../features/user/userSlice';
const Header = (props)=>{
    const dispatch = useDispatch();
    const history = useHistory();
    const userName = useSelector(selectUserName);
    const userPhoto = useSelector(selectUserPhoto);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Commented out Firebase authentication for localhost development
  // useEffect(()=>{
  //     auth.onAuthStateChanged(async user=>{
  //           if(user){
  //               setUser(user);
  //               history.push('/home')
  //           }
  //     })
  // },[userName]);
  
  
    // Commented out Firebase authentication for localhost development
    // const handelAuth = ()=>{
    //    if(!userName){ auth.signInWithPopup(provider).then(result=>{
    //             setUser(result.user);
    //     }).catch(err=>{
    //          alert(err.message);
    //     })}
    //     else if(userName){
    //        auth.signOut().then(()=>{
    //         dispatch(setSignOutState);
    //         history.push("/");
    //        }).catch(err => alert(err.message))       }
    // }

    const handelAuth = ()=>{
       // Mock authentication for localhost - just navigate to home
       if(!userName){
           // Simulate a logged in user for localhost development
           setUser({
               displayName: "Local User",
               email: "local@example.com",
               photoURL: "/images/group-icon.png"
           });
       } else {
           dispatch(setSignOutState);
           history.push("/");
       }
    }

    const setUser = user=>{
        dispatch(setUserLoginDetails({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
        }));
    }

return (
    <>
    <Nav> 
        <Logo>
            <img src="/images/logo.svg" alt="Disney+"/>
        </Logo>
        {!userName ?( <Login  onClick ={handelAuth} >Login</Login> ) : (<> 
        <Menuitem>
        <a href="/home">
            <img src="/images/home-icon.svg" alt="HOME"/>
            <span>HOME</span>
        </a>
        <a href="/home">
            <img src="/images/search-icon.svg" alt="SEARCH"/>
            <span>SEARCH</span>
        </a>
        <a href="/home">
            <img src="/images/watchlist-icon.svg" alt="WATCHLIST"/>
            <span>WATCHLIST</span>
        </a>
        <a href="/home">
            <img src="/images/original-icon.svg" alt="ORIGINALS"/>
            <span>ORIGINALS</span>
        </a>
        <a href="/home">
            <img src="/images/movie-icon.svg" alt="MOVIES"/>
            <span>MOVIES</span>
        </a>
        <a href="/home">
            <img src="/images/series-icon.svg" alt="SERIES"/>
            <span>SERIES</span>
        </a>

        </Menuitem>

        <MobileMenuToggle onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
        </MobileMenuToggle>
       
       <SignOut>
       <UserImage src = {userPhoto} alt={userName}></UserImage>
       <DropDown> 
           <span onClick={handelAuth}>Sign Out</span>
       </DropDown>
       </SignOut>
       
        </>)}
    </Nav>
    
    {isMobileMenuOpen && (
        <MobileMenu>
            <MobileMenuHeader>
                <Logo>
                    <img src="/images/logo.svg" alt="Disney+"/>
                </Logo>
                <CloseButton onClick={() => setIsMobileMenuOpen(false)}>✕</CloseButton>
            </MobileMenuHeader>
            <MobileMenuItems>
                <a href="/home" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src="/images/home-icon.svg" alt="HOME"/>
                    <span>HOME</span>
                </a>
                <a href="/home" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src="/images/search-icon.svg" alt="SEARCH"/>
                    <span>SEARCH</span>
                </a>
                <a href="/home" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src="/images/watchlist-icon.svg" alt="WATCHLIST"/>
                    <span>WATCHLIST</span>
                </a>
                <a href="/home" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src="/images/original-icon.svg" alt="ORIGINALS"/>
                    <span>ORIGINALS</span>
                </a>
                <a href="/home" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src="/images/movie-icon.svg" alt="MOVIES"/>
                    <span>MOVIES</span>
                </a>
                <a href="/home" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src="/images/series-icon.svg" alt="SERIES"/>
                    <span>SERIES</span>
                </a>
            </MobileMenuItems>
        </MobileMenu>
    )}
    </>
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

    @media (max-width: 768px) {
        padding: 0 20px;
        height: 60px;
    }
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

@media (max-width: 768px) {
    max-width: 60px;
    width: 60px;
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

const MobileMenuToggle = styled.button`
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 30px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1001;

    @media (max-width: 788px) {
        display: flex;
    }

    span {
        width: 30px;
        height: 3px;
        background: rgb(249, 249, 249);
        border-radius: 3px;
        transition: all 0.3s ease;
    }
`;

const MobileMenu = styled.div`
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #090b13;
    z-index: 1000;
    padding: 20px;
    overflow-y: auto;

    @media (max-width: 788px) {
        display: block;
    }
`;

const MobileMenuHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(249, 249, 249, 0.1);
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: rgb(249, 249, 249);
    font-size: 32px;
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const MobileMenuItems = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    a {
        display: flex;
        align-items: center;
        padding: 15px;
        color: rgb(249, 249, 249);
        text-decoration: none;
        border-radius: 8px;
        transition: background 0.3s ease;

        &:hover {
            background: rgba(249, 249, 249, 0.1);
        }

        img {
            width: 24px;
            height: 24px;
            margin-right: 15px;
        }

        span {
            font-size: 16px;
            letter-spacing: 1.5px;
        }
    }
`;

const Login = styled.a`
    background-color : rgba(0,0,0,0,0.6);
    padding:8px 16px;
    letter-spacing: 1.4px;
    border: 0.5px solid #f9f9f9;
    border-radius:4px;
    transition: all 0.2s ease 0s;
    cursor: pointer;

    &:hover{
    background-color:#f9f9f9;
    color:black;
    border-color: transparent;
    
}

    @media (max-width: 768px) {
        padding: 6px 12px;
        font-size: 12px;
    }
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

@media (max-width: 768px) {
    width: 40px;
    height: 40px;
}

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