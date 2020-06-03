import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import styled from "styled-components"
import { useFactoryContract, useWeb3React } from "../../hooks"
import Web3Status from "../Web3Status"
import { utils } from "ethers"

import { Link } from "../../theme"

const tokenFormItems = [
  {
    name:"tokenName",
    type: "text",
    placeholder:"Personal Token Name",
  },
  {
    name: "symbol",
    type: "text",
    placeholder: "What are your Initials? (Token Symbol)",
  },
  {
    name: "tos", 
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

function PersonalToken({ history }) {
  const [tokenForm, setTokenForm] = useState({
    "name": "",
    "symbol": "",
    "stamp": "test",
    "decimals": 6,
    "initialSupply": utils.parseEther("240000"),
    "cap": utils.parseEther("2400000")
  })

  const { account } = useWeb3React()

  const factory = useFactoryContract();

  const handleChange = (event) => {
    setTokenForm({
      ...tokenForm,
      [event.target.id]: event.target.value
    });
  }

  const handleSubmit = (event) => {
    // alert('A name was submitted: ' + newBadge.name);
    event.preventDefault();
    onCreateToken(tokenForm)
  }

  async function onCreateToken(token) {
    console.log(token)
    console.log(account)
    let result = await factory.newLexToken(
      token.name,                                     //  new token name
      token.symbol,                                   //  new token symbol
      token.stamp,                                    //  new token stamp?
      token.decimals,                                 //  [constant] new token decimals 
      token.cap,                                      //  [constant] new token maximum supply cap
      token.initialSupply,                            //  [constant] new token initial supply
      account,                                        //  new token owner
      true,                                           //  [constant] new token governed by LexDAO
      {
        value: utils.parseEther("0.0009")             //  lexdao tribute
      }
    )
    
    console.log(result);
    return result;
  }

  return(
    <Wrapper>
      <div style={{ gridArea: 'header', textAlign: 'center' }}>
        <h1>LexDAO Personal Token Factory</h1>
        <sub>Lawyer built. Legal engineer approved.</sub>
      </div>
      <Description>
        <h3>Why use "LexDAO Certified" personal tokens?</h3>
        <p>For one, these are the tokens we use, and we're a bunch of lawyers.</p>

        <h3>Standardized Values:</h3>
        <p>
          1 Token = 1 Minute of Your Time<br />
          Initial Offering: 60,000 Tokens (1,000 Hrs)<br />
          Total Cap: 240,000 (4,000 Hrs) <br />
          Decimal places: 6
        </p>

        <h3>What about disputes?</h3>
        <p>If you're having trouble with a personal token transaction? LexDAO has your back with dispute resolution built in.</p>
        <p>Need to start a dispute?&nbsp;
          <Link onClick={() => history.push('/personal-token-dispute')}>
            Click Here
          </Link>
        </p>

        <h3>Some legal stuff:</h3>
        <p>
          <Link onClick={() => history.push('/why-email')}>
            Learn why you might want to attach your email.
          </Link>
        </p>
        <p>If you do not provide your own your Terms of Service link, your token will be governed by&nbsp;
          <Link onClick={() => history.push('/personal-token-dispute')}>
            LexDAO Default Personal Token TOS
          </Link>
        </p>
        <p>By clicking "Mint" you agreed to the&nbsp;
          <Link onClick={() => history.push('/personal-token-dispute')}>
            LexDAO Terms of Service
          </Link>.
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
