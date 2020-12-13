import React from 'react';

const AppContext = React.createContext({
  user: null,
  view: {
    path: '',
    params: new URLSearchParams()
  },
  handleSignIn: ({ user, token }) => {},
  handleSignOut: () => {}
});

export default AppContext;
