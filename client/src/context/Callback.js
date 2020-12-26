import React, { Component } from "react";

class Callback extends Component {
  componentDidMount = () => {
    // Handle authentication if expected values are in the URL.
    console.log('IAM IN CALLBACK FIRST');

    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      console.log('IAM IN CALLBACK');
      this.props.auth.handleAuthentication();
    } else {
      throw new Error("Invalid callback URL.");
    }
  };
  render() {
    return <h1>Loading...</h1>;
  }
}

export default Callback;
