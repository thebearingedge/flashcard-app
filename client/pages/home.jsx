import React from 'react';
import AppContext from '../app-context';
import AppContainer from '../components/app-container';
import withAuthRequired from '../lib/with-auth-required';

class HomePage extends React.Component {
  render() {
    const { user, handleSignOut } = this.context;
    return (
      <AppContainer username={user.username} onSignOut={handleSignOut}>
        <h1>Home Page</h1>
      </AppContainer>
    );
  }
}

HomePage.contextType = AppContext;

export default withAuthRequired(HomePage);
