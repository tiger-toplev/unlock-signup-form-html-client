import React from 'react';
import { Route, MemoryRouter as Router } from 'react-router-dom';
import Home from './pages/Home';
import SignupForm from './pages/Form';
import ErrorScreen from './pages/Error';
import EmptyErrorScreen from './pages/EmptyError';
import ServerErrorScreen from './pages/ServerError';
import ExtraOptionsScreen from './pages/ExtraOptions';
import UserProvider from './context/UserContext';

import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import SuccessScreen from './components/Steps/default/Success';
import ThanksScreen from './components/Steps/shared/Thanks';

function App() {
  return (
    <>
      <Router>
        <UserProvider>
          <div className="App">
            <Route exact path="/" component={Home} />
            <Route path="/dashboard" component={Home} />
            <Route path="/signup" component={SignupForm} />
            <Route path="/success" component={SuccessScreen} />
            <Route path="/server-error" component={ServerErrorScreen} />
            <Route path="/thankyou" component={ThanksScreen} />
            <Route path="/extra-options" component={ExtraOptionsScreen} />
            <Route path="/error" component={ErrorScreen} />
            <Route path="/empty-error" component={EmptyErrorScreen} />
          </div>
          <NotificationContainer />
        </UserProvider>
      </Router>
    </>
  );
}

export default App;
