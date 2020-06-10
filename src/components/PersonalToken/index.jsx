import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import styled from "styled-components"
import { useFactoryContract, useWeb3React } from "../../hooks"
import Web3Status from "../Web3Status"
import { utils } from "ethers"

import ReactMarkdown from 'react-markdown';
import Handlebars from 'handlebars';
import Axios from 'axios';

import AWS from 'aws-sdk';

import { Link } from "../../theme"
import Modal from "../Modal"

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.REACT_APP_FLEEK_API_KEY,
  secretAccessKey: process.env.REACT_APP_FLEEK_API_SECRET,
  endpoint: 'https://storageapi.fleek.co',
  region: 'us-east-1',
  s3ForcePathStyle: true
});

const TOKEN_WEBHOOK = process.env.REACT_APP_TOKEN_WEBHOOK

const tokenFormItems = [
  {
    name:"name",
    type: "text",
    placeholder:"Your Name",
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

  /**
   * Converts React HTML Components to PDF
   * @param {*} html
   */
  const htmlToPDF = html => {

    const getTextFromChildren = (children, depth = 0) => {
      if (!children || !children.map || typeof children === 'string') return children;

      if (children[0] && children[0].props && children[0].props.children && typeof children[0].props.children === 'string') return children[0].props.children;

      let listCounter = 1;
      let content = [];

      children.map(c => {
        const style = c.key.split('-')[0];
        let text = [];

        switch(style) {
            case 'list':
              text.push(`${listCounter}. `);
              listCounter++;
              text.push({text: getTextFromChildren(c.props.children, depth + 1)});
              break;
            case 'listItem':
            case 'paragraph':
              text.push({text: getTextFromChildren(c.props.children, depth + 1)});
              text.push('\n');
              break;
            case 'strong':
              text = getTextFromChildren(c.props.children, depth + 1);
              break;
            default:
              text.push({text: getTextFromChildren(c.props.children, depth + 1)});
        }

        content.push({text, style});

        if (depth === 0) content.push('\n');

        return c;
      });

      return content;
    }

    return new Promise((resolve, reject) => {
      let content = getTextFromChildren(html.props.children);

      const styles = {
        heading: {
          fontSize: 22,
          bold: true,
        },
        strong: {
          bold: true
        }
      };

      const pdfDocGenerator = pdfMake.createPdf({content, styles});
      // pdfDocGenerator.getBlob((data) => {
      pdfDocGenerator.getBase64((data) => {
        resolve({data});
      });
    });
  }

  /**
   * Generates default TOS PDF and uploads to Fleek
   * @param {*} token
   */
  function generateDefaultTOSUrl(token) {
    return new Promise (async (resolve, reject) => {
    // Fetch default template
    const templateUrl = 'https://raw.githubusercontent.com/lexDAO/LexDAO-Documents/master/TOS/Personal-Token-Default-TOS.md';
    const templateMD = await Axios.get(templateUrl);

    // Adapt for
    const {data: templateForConversion} = templateMD;
    const template = templateForConversion.replace(/\$\[\[(.*?)\]\]/gi, e => `{{${e.substring(3,e.length-2).replace(/\s/gi,'_')}}}`);

    // Populate Variables
    const hbTemplate = await Handlebars.compile(template);

    // Adjust token vars for template insertion
    const tosVars = {
      'token_name': token.symbol,
      'consultant_name': token.name,
      'consultant_address': account,
    }
    // Create Markdown TOS with inserted variables
    const mkTOS = await hbTemplate(tosVars);

    // Create HTML TOS with inserted variables
    const htmlTOS = await ReactMarkdown({source: mkTOS})

    // Generate PDF
    const pdfDoc = await htmlToPDF(htmlTOS);

    // Store PDF
    const Key = `LexDAO-TOS/${Date.now()}-${token.symbol}.pdf`;
    const params = {
      Bucket: process.env.REACT_APP_FLEEK_BUCKET,
      Key,
      ContentType: 'application/pdf',
      Body: new Buffer(pdfDoc.data, 'base64'),
      ACL: 'public-read'
    };
    const request = await s3.putObject(params);
    // const response = await request.send();

    let hash = {url: [process.env.REACT_APP_FLEEK_BUCKET,'.storage.fleek.co/',Key].join('')};
    await request.on('httpHeaders', (statusCode, headers) => {
      console.log({statusCode});
      if (statusCode === 200) {
        const ipfsHash = headers['x-fleek-ipfs-hash'];
        // Do stuff with ifps hash....
        const ipfsHashV0 = headers['x-fleek-ipfs-hash-v0'];
        // Do stuff with the short v0 ipfs hash... (appropriate for storing on blockchains)

        hash = {...hash, ipfsHash, ipfsHashV0};

        // Return PDF Url
        resolve(hash);
      } else {
        reject('Issues saving TOS.')
      }
    }).send();
    })
  }

  async function onCreateToken(token) {

    // If no TOS link provided, generate default
    if (!token.stamp) {
      const TOSIPFSData = await generateDefaultTOSUrl(token);

      // Store the Fleek URL
      token.stamp = TOSIPFSData.url;

      // Optionally, can store the IPFS hash
      // Just uncomment the next line
      // token.stamp = TOSIPFSDATA.ipfsHash;
    }

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
          <p></p>
          <p>
            <Link href={"https://etherscan.io/tx/" + newTokenTransaction}>
              View your transaction on Etherscan
            </Link>
          </p>
          <br></br>
            <img style={{maxWidth: "90%"}} alt={"Transaction Screenshot"} src={require('../../assets/images/TxScreenshot.png')}/>
            <p>
            Wait for the transaction confirmation and follow this link <span>👆</span>
          </p>

          {/*<Button
            onClick={() => history.push('/')}
          >
            Learn More
          </Button> */}

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
