import React, { Suspense, lazy } from 'react'
import styled from 'styled-components'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'

import Web3ReactManager from '../components/Web3ReactManager'
import Footer from '../components/Footer'

import { getAllQueryParams } from '../utils'

const Landing = lazy(() => import('./Landing'))
const PersonalToken = lazy(() => import('./PersonalToken'))

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  height: 100vh;
`

const FooterWrapper = styled.div`
  width: 100%;
  min-height: 30px;
  align-self: flex-end;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  overflow: auto;
`

const Body = styled.div`
  width: 100%;
  /* margin: 0 1.25rem 1.25rem 1.25rem; */
`

export default function App() {
  const params = getAllQueryParams()
  return (
    <>
      <Suspense fallback={null}>
        <AppWrapper>
          <BodyWrapper>
            <Body>
              <Web3ReactManager>
                <HashRouter>
                  {/* this Suspense is for route code-splitting */}
                  <Suspense fallback={null}>
                    <Switch>
                      <Route
                        path="/personal-token"
                        component={() => <PersonalToken params={params} />}
                      />
                      <Route
                        path="/"
                        component={() => <Landing params={params} />}
                      />
                      <Redirect to="/" />
                    </Switch>
                  </Suspense>
                </HashRouter>
              </Web3ReactManager>
            </Body>
          </BodyWrapper>
          <FooterWrapper>
            <Footer />
          </FooterWrapper>
        </AppWrapper>
      </Suspense>
    </>
  )
}
