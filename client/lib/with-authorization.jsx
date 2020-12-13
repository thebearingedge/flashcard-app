import React from 'react';
import AppContext from '../app-context';

export default function withAuthorization(Page) {

  class Authorized extends React.Component {
    render() {
      if (!this.context.user) {
        window.location.hash = 'sign-in';
        return null;
      }
      return <Page />;
    }
  }

  Authorized.contextType = AppContext;

  return Authorized;
}
