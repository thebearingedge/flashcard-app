import React from 'react';
import AppContext from '../app-context';

export default function withAuthRequired(PageComponent) {

  class Authorized extends React.Component {
    render() {
      if (!this.context.user) {
        window.location.hash = 'sign-in';
        return null;
      }
      return <PageComponent />;
    }
  }

  Authorized.contextType = AppContext;

  return Authorized;
}
