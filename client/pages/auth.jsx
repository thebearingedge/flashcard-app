import React from 'react';
import AppContext from '../app-context';
import AuthForm from '../components/auth-form';

export default class AuthPage extends React.Component {
  render() {
    const { user, view, handleSignIn } = this.context;
    if (user) {
      window.location.hash = '';
      return null;
    }
    const weclomeMessage = view.path === 'sign-in'
      ? 'Please sign in to continue'
      : 'Create an account to start making flash cards!';
    return (
      <div className="row pt-5 align-items-center">
        <div className="col-12 offset-0 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-xl-4 offset-xl-4">
          <header className="text-center">
            <h2 className="mb-2">
              <i className="fas fa-bolt me-2" />
              Flashcard App
            </h2>
            <p className="text-muted mb-4">{ weclomeMessage }</p>
          </header>
          <div className="card p-3 ">
            <AuthForm
              key={view.path}
              action={view.path}
              onSignIn={handleSignIn} />
          </div>
        </div>
      </div>
    );
  }
}

AuthPage.contextType = AppContext;
