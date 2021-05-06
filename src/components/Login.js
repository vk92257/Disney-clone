import styled from 'styled-components'
const Login = (pops)=>{
return (
    <Container>
        <Component>
            <CTA>
                <CTALogoOne src='/images/cta-logo-one.svg' alt=""/>
                <SingUp>Get All There</SingUp>
                <Discription>Get Premier Access to Raya and Last Dragon for an additional fee with a Disney+ subscription. As of 03/26/21,the price of Disney+ and The Disney Bundel will incresed by Rs 1000.</Discription>
                <CTALogoTwo src='/images/cta-logo-two.png' alt=""/>
            </CTA>
            <BGimage/>
        </Component>
    </Container>
);
}

const Container = styled.section`
overflow: hidden;
display: flex;
flex-direction : column;
text-align : center;
height : 100vh;
`;
const Component = styled.div`
margin-bottom: 10vh;
width : 100%;
position : relative;
min-height:100vh;
box-sizing : border-box;
display:flex;
justify-content : center;
align-items: center;
flex-direction:column;
height:100%;
padding:80px 20px;
`;

const BGimage = styled.div `
height:100vh;
background-position:top;
background-size:cover;
background-repeat:no-repeat;
position:absolute;
background-image: url('/images/login-background.jpg');
/* background-image: url("https://image.shutterstock.com/image-photo/mountains-under-mist-morning-amazing-260nw-1725825019.jpg"); */
top:0;
right:0;
left:0;
z-index : -1;
`;

const CTA = styled.div `
margin-bottom:2px;
max-width:650px;
flex-wrap:wrap;
display: flex;
flex-direction: column;
justify-content:center;
margin-top:0;
align-items:center;
text-align:center;
margin-right:auto;
margin-left:auto;
transition-timing-function:ease-out;
transition: opacity 0.2s;
width:100%;

`;
const CTALogoOne = styled.img`
margin-bottom:12px;
max-width:600px;
min-height:1px;
display:block;
width:100%;
`;

const SingUp = styled.a`
font-weight:bold;
margin-bottom:12px;
width:100%;
border-radius:5px;
font-size:18px;
border:1px solid transparent;
padding:16.5px 0;
letter-spacing:1.5px;
color:#f9f9f9;
background-color:#0063e5;
&:hover{
    background-color:#8483ee;
    
};
`;

const Discription = styled.p`
font-size:13px;
font-family:Arina-Roman sans-serif;
color: hsla(0,0%,95.3%,1);
margin:0 0 24px;
line-height:1.5;
letter-spacing:1.5px;
`;

const CTALogoTwo = styled.img`
margin-bottom:12px;
max-width:600px;
min-height:1px;
display:inline-block;
vertical-align:bottom;
width:100%;
margin-bottom:20px
`;


export default Login;