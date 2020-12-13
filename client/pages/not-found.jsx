import React from 'react';
import Navbar from '../components/navbar';
import PageContainer from '../components/page-container';

export default class NotFoundPage extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <PageContainer>
          <h1>Not Found</h1>
        </PageContainer>
      </>
    );
  }
}
