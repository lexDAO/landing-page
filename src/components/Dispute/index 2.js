import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import styled from "styled-components"

import { Link } from "../../theme"
import Modal from "../Modal"

const DISPUTE_WEBHOOK = process.env.REACT_APP_DISPUTE_WEBHOOK

const tokenFormItems = [
  {
    name: "name",
    type: "text",
    placeholder:"What's your name?",
  },
  {
    name: "email",
    type: "email",
    placeholder: "What is your email address?",
  }
]

const Wrapper = styled.div`
  display: grid;
  grid-template-areas: "header header"\n"description form";
  grid-template-rows: 30% auto;
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

const TextArea = styled.textarea`
  width: 80%;
  height: 4rem;
  line-height: 1.5rem;
  margin-bottom: 3.5rem;
  border-radius: .25rem;
  border: 1px solid #000000;
  color: #3F3F3F;
  font-size: 0.875rem;
  padding: 0.5rem;
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

const ModalWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;

  & > p {
    width: 80%;
    line-height: 1.5rem;
  }

  & > a {
    width: 150px;
    max-width: none;
  }
`

function Dispute({ history }) {
  const [disputeForm, setDisputeForm] = useState({
    "name": "",
    "email": "",
    "description": "",
  })

  const [showModal, setShowModal] = useState(false)

  const handleChange = (event) => {
    setDisputeForm({
      ...disputeForm,
      [event.target.id]: event.target.value
    });
  }

  const handleSubmit = (event) => {
    // alert('A name was submitted: ' + newBadge.name);
    event.preventDefault();
    onSubmitDispute(disputeForm)
  }

  async function onSubmitDispute(dispute) {
    const result = await fetch(DISPUTE_WEBHOOK, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: dispute.name,
        email: dispute.email,
        description: dispute.description
      })
    });

    if (result.status === 200) {
      setShowModal(true)
    }
    
    return result;
  }

  return(
    <Wrapper>
      <Modal 
        isOpen={showModal}
        onDismiss={() => setShowModal(false)}
        minHeight={null}
        maxHeight={200}
      >
        <ModalWrap>
          <h2>Your submission has been received!</h2>
          <p>
            We'll update you on the next steps for your dispute in the next 3 business days. If you have any questions reach out to us on&nbsp;
            <Link href="https://lexdao.chat">
              Discord
            </Link>.
          </p>
          <Button
            onClick={() => history.push('/')}
          >
            There's no place like home
          </Button>
        </ModalWrap>
      </Modal>
      <div style={{ gridArea: 'header', textAlign: 'center' }}>
        <Logo 
          src={require('../../assets/images/LexDAO-logo.png')} 
          alt="LexDAO Logo" 
          onClick={() => history.push('/')}
        />
        <h1>
          Personal Token Dispute
        </h1>
        <sub>For all other disputes... there's LexDAO.</sub>
      </div>
      <Description>
        <h3>What is a token dispute?</h3>
        <p>LexDAO Certified Personal Tokens have protection built in. If you're having any kind of problem, use this form to let us know. We'll do our best to get it resolved.</p>

        <h3>How will a dispute be resolved?</h3>
        <p>We'll review the facts presented by both parties and ensure an objective outcome.</p>

        <h3>When will I hear about my dispute?</h3>
        <p>While we're researching your case we'll be in contact with you. You should hear from LexDAO within 3 business days.</p>
      </Description>
      <TokenForm>
        
        <div>
          <h3>Submit a dispute</h3>
          <p></p>
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
          <TextArea 
            id="description" 
            onChange={handleChange} 
            placeholder="Describe the dispute..."
          />
        </form>
        <Button
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </TokenForm>
    </Wrapper>
  )
}

export default withRouter(Dispute)
