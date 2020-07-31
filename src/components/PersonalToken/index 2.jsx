import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import styled from "styled-components"
import { useFactoryContract, useWeb3React } from "../../hooks"
import Web3Status from "../Web3Status"
import { utils } from "ethers"

import { Link } from "../../theme"
import Modal from "../Modal"
// import { Bold } from "react-feather"

const TOKEN_WEBHOOK = process.env.REACT_APP_TOKEN_WEBHOOK

const tokenFormItems = [
  {
    name:"name",
    type: "text",
    placeholder:"Personal Token Name",
  },
  {
    name: "symbol",
    type: "text",
    placeholder: "What are your Initials? (Token Symbol)",
  },
  {
    name: "stamp", 
    type: "text",
    placeholder: "Terms of Service Link (Optional)" 
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email (Optional)"
  }
]

const Wrapper = styled.div`
  display: grid;
  grid-template-areas: "header header"\n"description form";
  grid-template-rows: 20% auto;
  grid-template-columns: 45% 55%;
`

const Logo = styled.img`
  height: 50px;
  margin-top: 15px;

  :hover {
    cursor: pointer;
  }
`

const Description = styled.div`
  grid-area: description;
  width: 80%;
  margin: auto;
  line-height: 1.7rem;
  padding-left: 20%;

  & > p {
    font-size: 0.938rem;

    & > a {
      color: ${({ theme }) => theme.uniswapPink};
      text-decoration: none;

      :hover {
        text-decoration: underline;
      }
    }
  }
`

const TokenForm = styled.div`
  grid-area: form;
  width: 80%;
  margin: auto;
  margin-top:0;
  
  & > form {
    display: flex;
    flex-direction: column;
    justify-content: center;

    & > input {
      width: 80%;
      line-height: 1.5rem;
      margin-bottom: 3.5rem;
      border-radius: .25rem;
      border: 1px solid #000000;
      color: #3F3F3F;
      font-size: 0.875rem;
      padding: 1rem 0.5rem;
    }
  }
`

const Button = styled.a`
  display: block;
  max-width: 80px;
  padding: 1rem 3rem;
  background-image: linear-gradient(40deg, #28BCFD 20%, #1D78FF 51%, #28BCFD 90%);
  border-radius: 5px;
  text-align: center;

  :hover {
    cursor: pointer;
  }
`

const ModalWrapper = styled.div`
  width: 100%;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & > a {
    max-width: none;
  }
`

function PersonalToken({ history }) {
  const [tokenForm, setTokenForm] = useState({
    "name": "",
    "symbol": "",
    "stamp": "",
    "decimals": 6,
    "initialSupply": 60000 * 10 ** 6,
    "cap": 240000 * 10 ** 6
  })

  const [showModal, setShowModal] = useState(false)

  const [newTokenTransaction, setNewTokenTransaction] = useState()

  const { account } = useWeb3React()

  const factory = useFactoryContract();

  const handleChange = (event) => {
    setTokenForm({
      ...tokenForm,
      [event.target.id]: event.target.value
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreateToken(tokenForm)
  }

  async function onCreateToken(token) {
    let result = await factory.newLexToken(
      token.name,                                     //  new token name
      token.symbol,                                   //  new token symbol
      token.stamp,                                    //  new token terms of service
      token.decimals,                                 //  [constant] new token decimals 
      token.cap,                                      //  [constant] new token maximum supply cap
      token.initialSupply,                            //  [constant] new token initial supply
      account,                                        //  new token owner
      true,                                           //  [constant] new token governed by LexDAO
      {
        value: utils.parseEther("0.0009")             //  lexdao tribute
      }
    )

    const response = await fetch(TOKEN_WEBHOOK, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: token.name,
        email: token.email,
        symbol: token.symbol,
        stamp: token.stamp,
        account: account,
        transaction: result.hash,
      })
    });
    
    console.log(response);
    console.log(result);

    if (result) {
      setNewTokenTransaction(result.hash)
      setShowModal(true)
    }
    
    return token;
  }

  return(
    <Wrapper>
      <Modal
        isOpen={showModal}
        onDismiss={() => setShowModal(false)}
      >
        <ModalWrapper>
          <h2>You're Tokenized!</h2>
          <p>One small step for you. One giant leap for critical work.</p>
          <p>
            <Link href={"https://rinkeby.etherscan.io/tx/" + newTokenTransaction}>
              Check it out on etherscan - 
            </Link>
          </p>
          <Button
            onClick={() => history.push('/')}
          >
            Learn More
          </Button>
        </ModalWrapper>
      </Modal>
      <div style={{ gridArea: 'header', textAlign: 'center' }}>
        <Logo 
          src={require('../../assets/images/LexDAO-logo.png')} 
          alt="LexDAO Logo" 
          onClick={() => history.push('/')}
        />
        <h1>Personal Token Factory</h1>
        <sub>LexDAO built. Legal engineer approved.</sub>
      </div>
      <Description>
        <h3>Why use "LexDAO Certified" personal tokens?</h3>
        <p>To start, this is the token code we use within LexDAO! We've used legal engineering to build in stuff like dispute resolution, token terms of service, and some standardized values that just make sense. </p>

        <h3>Standardized Values:</h3>
        <p>
          1 Token = 1 Minute of Your Time<br />
          Initial Offering: 60,000 Tokens (1,000 Hrs)<br />
          Total Cap: 240,000 Tokens (4,000 Hrs) <br />
          Decimal places: 6 <br />
          LexDAO Fee: .0009 ETH
        </p>

        <h3>What about disputes?</h3>
        <p>Having trouble with a personal token transaction? LexDAO has your back with dispute resolution built in.</p>
        <p><strong>Need to start a dispute?</strong>&nbsp;
          <Link onClick={() => history.push('/personal-token-dispute')}>
            Click Here
          </Link>
        </p>

        <h3>Some legal stuff:</h3>
        <p>If you do not provide your own your Terms of Service link, your token will be governed by&nbsp;
          <Link id="link" href="https://hackmd.io/@LexDAO/Default-Personal-Token-TOS">
            LexDAO Default Personal Token TOS
          </Link>
        </p>
        <p>By clicking "Mint" you agreed to the&nbsp;
          <Link id="link" href="https://hackmd.io/@LexDAO/Token-Factory-TOS">
            LexDAO Terms of Service
          </Link>.
        </p>
        <p>
        <Link id="link" href="https://hackmd.io/@LexDAO/why-email">
            Learn why you might want to attach your email.
          </Link>
        </p>
      </Description>
      <TokenForm>
        
        <div>
          <h3>Step 1: Connect a Web3 Wallet</h3>
          <div style={{ maxWidth: '200px' }}>
            <Web3Status />
          </div>
          <h3>Step 2: Complete the following form</h3>
        </div>
        <form>
          {tokenFormItems.map(item => {
            return(
              <input
                key={item.name}
                id={item.name}
                type={item.type}
                placeholder={item.placeholder}
                onChange={handleChange}
              />
            )
          })}
        </form>
        <Button
          onClick={handleSubmit}
        >
          Mint
        </Button>
      </TokenForm>
    </Wrapper>
  )
}

export default withRouter(PersonalToken)
