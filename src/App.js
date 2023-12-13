import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingIndicatorComponent from "./common/loader/loading-indicator-component";
import AppNotificationComponent from "./common/notification/app-notification-component";
import ChooseService from "./choose-service-slot/ChooseService";
import { Route, Routes } from "react-router-dom";
import ChooseSlot from "./choose-service-slot/ChooseSlot";
import { BrowserRouter as Router } from "react-router-dom";
import MakePaymentContainer from "./payment/PaymentContainer";
import Navbar from './misc/Navbar';
import PrivateRoute from './misc/PrivateRoute'
import { Dimmer, Header, Icon } from 'semantic-ui-react'
import { config } from './Constants'

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import VerifyUser from "./admin/VerifyUser";

const stripePromise = loadStripe("pk_test_PwSfk3SC2VpVYmqjooO9O1Gu00H7iBCCpa");

const App = () => {

  const keycloak = new Keycloak({
    url: `${config.url.KEYCLOAK_BASE_URL}`,
    realm: "book-realm",
    clientId: "book-app"
  })
  const initOptions = { pkceMethod: 'S256' }

  const handleOnEvent = async (event: AuthClientEvent, error: AuthClientError | undefined) => {
    if (event === 'onAuthSuccess') {
      if (keycloak.authenticated) {
        //TODO: ignore for now
      }
    }
  }  

  const loadingComponent = (
    <Dimmer inverted active={true} page>
      <Header style={{ color: '#4d4d4d' }} as='h2' icon inverted>
        <Icon loading name='cog' />
        <Header.Content>Keycloak is loading
          <Header.Subheader style={{ color: '#4d4d4d' }}>or running authorization code flow with PKCE</Header.Subheader>
        </Header.Content>
      </Header>
    </Dimmer>
  )

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      LoadingComponent={loadingComponent}
      onEvent={(event, error) => handleOnEvent(event, error)}
    >
    <Router>
      <div>
        <LoadingIndicatorComponent />
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
          <a className="navbar-brand" href="/">Ar Salon & Day Spa!</a>
        </nav>
        <main role="main" className="container">
          <div className="padding-container">
            <Navbar />
            <Routes>
              <Route path="/" element={<PrivateRoute><ChooseService /></PrivateRoute>} />
              <Route path="/chooseslot/:serviceId/:serviceName" element={<PrivateRoute><ChooseSlot /></PrivateRoute>} />
              <Route path="/makepayment/:slotId/:serviceId/:serviceName" element={
                <PrivateRoute><Elements stripe={stripePromise}>
                  <MakePaymentContainer />
                </Elements></PrivateRoute>
              } />
              <Route path="/admin/verifyuser"  element={<PrivateRoute><VerifyUser/></PrivateRoute>} />
              <Route path="*" element={<PrivateRoute><ChooseService /></PrivateRoute>} />
            </Routes>

          </div>
        </main>
        <AppNotificationComponent />
      </div>
    </Router>
    </ReactKeycloakProvider>    
  );
}

export default App;
