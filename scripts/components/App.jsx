import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

var App = React.createClass({
  getInitialState() {
    return {
      clicks: 0
    };
  },

  render() {
    return (
      <h1 onClick={this.onClick}>Hello, world! {this.state.clicks} clicks!</h1>
    );
  },

  onClick() {
    this.setState({clicks: this.state.clicks + 1});
  }
});

export default App;
