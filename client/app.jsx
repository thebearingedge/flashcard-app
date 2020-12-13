import React from 'react';
import AppContext from './app-context';
import parseRoute from './lib/parse-route';
import AuthPage from './pages/auth';
import HomePage from './pages/home';
import NotFoundPage from './pages/not-found';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      view: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        view: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('flashcard-app-token');
    if (!token) {
      this.setState({ isAuthorizing: false });
      return;
    }
    const req = {
      method: 'GET',
      headers: {
        'X-Access-Token': token
      }
    };
    fetch('/api/auth', req)
      .then(res => res.json())
      .then(({ user }) => {
        this.setState({ user, isAuthorizing: false });
      });
  }

  handleSignIn({ user, token }) {
    localStorage.setItem('flashcard-app-token', token);
    this.setState({ user });
    window.location.hash = '';
  }

  handleSignOut() {
    window.localStorage.removeItem('flashcard-app-token');
    this.setState({ user: null });
    window.location.hash = 'sign-in';
  }

  renderPage() {
    switch (this.state.view.path) {
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
    const { user, view } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, view, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        { this.renderPage() }
      </AppContext.Provider>
    );
  }
}
