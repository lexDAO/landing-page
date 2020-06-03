import React from "react"
import styled from "styled-components"
import { withRouter } from "react-router-dom"

const dappsList = [
  {
    "name": "LexDAO Personal Token Factory",
    "background": "linear-gradient(32deg, #FF4137, #FDC800)",
    "imgPath": "factory",
    "description": "Tokenize yourself with the LexDAO Certified Personal Token Factory.<br />We make minting a personal token quick, easy, and safe.",
    "cta": "Issue Personal Token",
    "ctaBackground": "linear-gradient(40deg, #28BCFD 20%, #1D78FF 51%, #28BCFD 90%)",
    "ctaRoute": "/personal-token",
    "bullets": [
      "Lawyer Built",
      "Legal Engineer Certified",
      "Legally Compliant",
      "DAO Powered Dispute Protection",
      "Built in Terms of Service"
    ]
  }
]

const Wrapper = styled.div`
  width: 100%;
`

const HeroSection = styled.div`
  background-image: ${({theme}) => theme.backgroundGradient}; 
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "left right";
  height: 650px;
  padding-left: 5%;
  padding-right: 5%;
`

const Left = styled.div`
  grid-area: left;
  width: 80%;
  margin: auto;

  & > h2 {
    font-size: 2rem;
    font-weight: 700;
  }

  & > p {
    font-size: 1.125rem;
    line-height: 1.9rem;
    font-weight: 700;
  }
`

const Button = styled.a`
  background-image: linear-gradient(40deg, #BF68E6 20%, #9E48CD 51%, #BF68E6 90%);
  box-shadow: rgb(94, 35, 126) 0px 0px 12px 0px;
  border-radius: 5px;
  display: inline-flex
  width: 200px;
  height: 50px;
  font-weight: 700;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  color: white;
  text-decoration: none;

  & :hover {

  }
`

const Right = styled.div`
  gridArea: right;
  text-align: center;
`

const HeroImage = styled.img`
  max-width: 550px;
  margin: auto;
`

const Disclaimer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 3%;
  padding-bottom: 3%;

  & > h3 {
    font-size: 2rem;
    color: #161616;
    padding; 20px 0;
  }

  & > p {
    color: #3F3F3F;
    width: 80%;
  }
`

const Dapps = styled.div`
  background-image: ${({theme}) => theme.backgroundGradient};
  padding: 20px;
  text-align: center;
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 3%;
  
  > h3 {
    font-size: 2rem;
    text-align: center;
  }

  > sub {
    font-size: 0.9rem;
  }
`

const Dapp = styled.div`
  display: grid;
  grid-template-areas: "left right";
  grid-template-columns: 2fr 4fr;
  width: 90%;
  margin: auto;
  padding: 10px;
`

const Card = styled.div`
  background-image: ${({backgroundImage}) => backgroundImage};
  border-radius: 0.35rem;
  height: 330px;
  width: 330px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;

  & > img {
    max-width: 50%;
  }
`

const StartDapp = styled.a`
  background-image: ${({backgroundImage}) => backgroundImage};
  margin-top: 25px;
  padding: 1rem 3rem;
  border-radius: 5px;
  
  :hover {
    cursor: pointer;
  }
`

const Description = styled.div`
  text-align: left;
  margin-top: 100px;
  margin-left: 5%;
`

const Bullets = styled.ul`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 40px;

  & > li {
    width: 50%;
    height: 50px;
    text-align: left;
    list-style-type: none;  
  }
`
const About = styled.div`
background-color: white;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
text-align: center;
padding-top: 3%;

& > h3 {
  font-size: 2rem;
  color: #161616;
  padding; 20px 0;
}

& > p {
  color: #3F3F3F;
  width: 80%;
}
`

const Footer = styled.div`
  background-color: ${({theme}) => theme.white};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 3%;
  padding-bottom: 3%;

  & > h3 {
    font-size: 2rem;
    color: #161616;
    padding; 20px 0;
  }

  & > p {
    color: #3F3F3F;
    width: 80%;
  }

  & > a {
    margin-top: 15px;
  }
`

function LandingPage({ history }) {

  return (
    <Wrapper>
      <HeroSection>
        <Left>
          <h2>
            LexDAO. The decentralized legal engineering guild.
          </h2>
          <div>
            <Button href="#join">
              Join LexDAO
            </Button>
            <Button href="http://lexdao.chat/">
              Discord
            </Button>
          </div>
          <p style={{ fontSize: '1.5rem' }}>
            Check out our dApps <span role="img" aria-label="below">👇</span>
          </p>
        </Left>
        <Right>
          <HeroImage 
            src={require("../../assets/images/banner-graphic.png")} 
            alt="LexDAO Shield" 
          />
        </Right>   
      </HeroSection>
      <Disclaimer>
        <h3>
          Disclaimer
        </h3>
        <p>
          LexDAO is a club, not a law firm and not even a legal entity. Unless otherwise stated in writing, all conversations and communications with DAO members which take place in any public or semi-public forum (e.g. Discord or Twitter) are not to be considered legal advice for any purpose. To the extent applicable, LexDAO, LLC, a Delaware registered LLC, is the only legal entity with which it is possible to conduct contractual business with the DAO. For explicit statement, no individual DAO member is an agent of other DAO members or for LexDAO, LLC.
        </p>
      </Disclaimer>
      <Dapps>
        <h3>
          Certified LexDAO Dapps
          </h3>
        <sub>
          dApps built by legal engineers
        </sub>
        {dappsList.map(dapp => {
          return(
            <Dapp key={dapp.name}>
              <div style={{ gridArea: 'left' }}>
                <h4>
                  {dapp.name}
                </h4>
                <Card backgroundImage={dapp.background}>
                  <img 
                    src={require("../../assets/images/" + dapp.imgPath + ".png")} 
                    alt={dapp.imgPath + " image"}
                  />
                  <StartDapp 
                    backgroundImage={dapp.ctaBackground}
                    onClick={() => history.push(dapp.ctaRoute)}
                  >
                    {dapp.cta}
                  </StartDapp>
                </Card>
              </div>
              <div style={{ gridArea: 'right' }}>
                <Description dangerouslySetInnerHTML={{ __html: dapp.description }} />
                <Bullets>
                  {dapp.bullets.map(bullet => {
                    return(
                      <li key={bullet}>
                        <span className="fa-li"><i className="fas fa-check-square"></i></span>
                        {bullet}
                      </li>
                    )
                  })}
                </Bullets>
              </div>
            </Dapp>
            
          )
        })}
      </Dapps>
      <About>
              <h3>
              About LexDAO
              </h3>
              <p>
              LexDAO is a group of legal engineering professionals who are seeking to provide a trusted layer between the decentralized world of blockchains and a legal settlement layer in the real world. We are trying to bridge this layer to provide a working framework for organizations to work in a trustless and trusted manner using Ethereum, blockchains, smart contracts and decentralized organizations.
              </p>
            </About>
      <Footer>
        <h3 id="join">
          Join LexDAO
        </h3>
        <p>
          Want to join LexDAO? The best way is just to show up. Drop into the Discord, attend the weekly community calls, maybe throw down some code during the hacking sessions. If it's clear that you're contributing value, a LexDAO member might nominate you to join the DAO. If you're so fired up you can't wait, you can fill out the form launched by the button below to kick start a nomination by giving us your contact info.
        </p>
        <Button href="https://lexdao.typeform.com/to/jAvfLV">
          Join LexDAO
        </Button>
      </Footer>
    </Wrapper>
  )
}

export default withRouter(LandingPage);
