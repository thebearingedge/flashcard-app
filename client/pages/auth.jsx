import React from 'react';
import AppContext from '../app-context';
import AuthForm from '../components/auth-form';

function Welcome({ heading, message }) {
  return (
    <>
      <h2 className="mb-2">{heading}</h2>
      <p className="text-muted mb-4 ms-1">{message}</p>
    </>
  );
}

export default class AuthPage extends React.Component {
  render() {
    const { user, view, handleSignIn } = this.context;
    if (user) {
      window.location.hash = '';
      return null;
    }
    const heading = view.path === 'sign-in'
      ? 'Welcome Back'
      : 'Register';
    const message = view.path === 'sign-in'
      ? 'Please sign in to continue'
      : 'Create an account to get started!';
    return (
      <div className="bg-light">
        <div className="container">
          <div className="row min-vh-100 align-items-center">
            <div className="col-12 offset-0 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-xl-4 offset-xl-4">
              <Welcome heading={heading} message={message} />
              <div className="card p-3 mb-5 shadow-sm">
                <AuthForm action={view.path} onSignIn={handleSignIn} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AuthPage.contextType = AppContext;
