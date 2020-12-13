import React from 'react';
import Navbar from '../components/navbar';
import PageContainer from '../components/page-container';
import withAuthorization from '../lib/with-authorization';

class HomePage extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <PageContainer>
          <h1>Home Page</h1>
        </PageContainer>
      </>
    );
  }
}

export default withAuthorization(HomePage);
