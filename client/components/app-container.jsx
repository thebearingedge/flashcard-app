import React from 'react';

const styles = {
  pageContainer: {
    minHeight: 'calc(100vh - 3.5rem)'
  }
};

export default function AppContainer({ children, onSignOut }) {
  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">Flashcard App</a>
          <button className="btn btn-dark" onClick={onSignOut}>
            Sign out
            <i className="ms-2 fas fa-sign-out-alt" />
          </button>
        </div>
      </nav>
      <div className="container" style={styles.pageContainer}>
        { children }
      </div>
    </>
  );
}
