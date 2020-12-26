import React, { Component } from "react";
import Auth from "../../context/Auth";

class NotificationsPage extends Component {
  profile ={}
  constructor(props) {
    super(props);
    this.state = {
      auth: new Auth(this.props.history),
       tokenRenewalComplete: false
    }
  }

  state = {
    profile: null,
    error: ""
  };

    componentDidMount() {
    this.state.auth.renewToken(() =>
        this.setState({ tokenRenewalComplete: true })
    );
    console.log('the history props are ===>',this.props.history);
   this.state.auth.auth0.client.userInfo(localStorage.getItem("access_token"), (err, profile) => {
     console.log('the auth props are===>',profile);

     if (profile) this.profile = profile;
    })
    // this.loadUserProfile();
  }

  loadUserProfile() {
    console.log('IAM IN LOAD USER PROFILE');
    this.auth.getUserProfile((profile, error) =>
        this.setState({ profile})
    );
  }

  render() {

    console.log('USER PROFILE IS =====>', this.profile);
    if (!this.profile) return null;
    return (
        <>

          <h1>Profile</h1>

          <p>{this.profile.nickname}</p>
          <img
              style={{ maxWidth: 50, maxHeight: 50 }}
              src={this.profile.picture}
              alt="profile pic"
          />
          <pre>{JSON.stringify(this.profile, null, 2)}</pre>
        </>
    );
  }
}

export default NotificationsPage;
