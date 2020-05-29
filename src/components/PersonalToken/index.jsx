import React, { useState } from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  display: grid;
  grid-template-areas: "header header"\n"description form";
  grid-template-rows: 200px auto;
  grid-template-columns: 40% 60%;
`

const Description = styled.div`
  grid-area: description;
  width: 80%;
  margin: auto;
`

const TokenForm = styled.div`
  grid-area: form;
  width: 80%;
  margin: auto;
`

const Button = styled.a`
  display: block;
  max-width: 150px;
  padding: 1rem 3rem;
  background-image: linear-gradient(40deg, #28BCFD 20%, #1D78FF 51%, #28BCFD 90%);
  border-radius: 5px;

  :hover {
    cursor: pointer;
  }
`

export default function PersonalToken() {
  const [tokenForm, setTokenForm] = useState({})

  return(
    <Wrapper>
      <div style={{ gridArea: 'header', textAlign: 'center' }}>
        <h1>LexDAO Personal Token Factory</h1>
        <sub>Lawyer built. Legal engineer approved.</sub>
      </div>
      <Description>
        <h3>Why use "LexDAO Certified" personal tokens?</h3>

        For one, these are the tokens we use, and we're a bunch of lawyers.

        <h3>Standardized Values:</h3>
        1 Token = 1 Minute of Your Time

        Initial Offering: 240,000 Tokens (1,000 Hrs)

        Decimal places: 6

        <h3>What about disputes?</h3>

        If you're having trouble with a personal token transaction? LexDAO has your back with dispute resolution built in.

        Need to start a dispute? Click Here

        <h3>Some legal stuff:</h3>

        Learn why you might want to attach your email.

        If you do not provide your own your Terms of Service link, your token will be governed by LexDAO Default Personal Token TOS

        By clicking "Mint" you agreed to the LexDAO Terms of Service.
      </Description>
      <TokenForm>
        <div>
          Step 1: Connect a Web3 Wallet
          <Button>Connect A Wallet</Button>
          Step 2: Complete the following form
        </div>
        <form>
          <input id="tokenName" type="text" defaultValue="My Personal Token"/>
        </form>
      </TokenForm>
    </Wrapper>
  )
}
