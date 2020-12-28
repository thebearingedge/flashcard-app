import React from 'react';
import AppContext from '../app-context';
import Redirect from '../components/redirect';

export default function withAuthorization(Page) {

  class Authorized extends React.Component {
    render() {
      if (!this.context.user) {
        return <Redirect to="sign-in" />;
      }
      return <Page />;
    }
  }

  Authorized.contextType = AppContext;

  return Authorized;
}
