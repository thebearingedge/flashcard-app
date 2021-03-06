import React from 'react';
import AppContext from './app-context';
import parseRoute from './lib/parse-route';
import decodeToken from './lib/decode-token';
import AuthPage from './pages/auth';
import HomePage from './pages/home';
import NotFoundPage from './pages/not-found';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('flashcard-app-token');
    const user = token ? decodeToken(token) : null;
    this.setState({ isAuthorizing: false, user });
  }

  handleSignIn({ user, token }) {
    localStorage.setItem('flashcard-app-token', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('flashcard-app-token');
    this.setState({ user: null });
  }

  renderPage() {
    switch (this.state.route.path) {
      case '':
        return <HomePage />;
      case 'sign-in':
      case 'sign-up':
        return <AuthPage />;
      default:
        return <NotFoundPage />;
    }
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        { this.renderPage() }
      </AppContext.Provider>
    );
  }
}
