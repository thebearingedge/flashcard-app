import React from 'react';

export default class Redirect extends React.Component {
  componentDidMount() {
    const url = new URL(window.location);
    url.hash = this.props.to || '#';
    window.location.replace(url);
  }

  render() {
    return null;
  }
}
