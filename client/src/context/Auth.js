// // import auth0 from "auth0-js";
// //
// // export default class Auth {
// //   constructor(history) {
// //     this.history = history;
// //     this.userProfile = null;
// //     this.requestedScopes = "openid profile email read:courses";
// //     this.auth0 = new auth0.WebAuth({
// //       domain: "rathireactjsconsulting-dev.auth0.com",
// //       clientID: "ZrLE9o3S1k5gTb1wK4U73rnsgNVNHpSK",
// //       redirectUri: "http://localhost:3000/callback",
// //       audience:"http://localhost:3001",
// //
// //       responseType: "token id_token",
// //       scope:this.requestedScopes
// //     });
// //   }
// //
// //   login = () => {
// //     this.auth0.authorize();
// //   };
// //
// //   handleAuthentication = () => {
// //     this.auth0.parseHash((err, authResult) => {
// //       if (authResult && authResult.accessToken && authResult.idToken) {
// //         this.setSession(authResult);
// //         this.history.push("/");
// //       } else if (err) {
// //         this.history.push("/");
// //         alert(`Error: ${err.error}. Check the console for further details.`);
// //         console.log(err);
// //       }
// //     });
// //   };
// //
// //   setSession = authResult => {
// //     console.log(authResult);
// //     // set the time that the access token will expire
// //     const expiresAt = JSON.stringify(
// //       authResult.expiresIn * 1000 + new Date().getTime()
// //     );
// //     // If there is a value on the `scope` param from the authResult,
// //     // use it to set scopes in the session for the user. Otherwise
// //     // use the scopes as requested. If no scopes were requested,
// //     // set it to nothing
// //     const scopes = authResult.scope || this.requestedScopes || "";
// //
// //     console.log('the expiration time', expiresAt);
// //     localStorage.setItem("access_token", authResult.accessToken);
// //     localStorage.setItem("id_token", authResult.idToken);
// //     localStorage.setItem("expires_at", expiresAt)
// //     localStorage.setItem("scopes", JSON.stringify(scopes));
// //   };
// //
// //   isAuthenticated() {
// //     const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
// //     return new Date().getTime() < expiresAt;
// //   }
// //   logout = () => {
// //     localStorage.removeItem("access_token");
// //     localStorage.removeItem("id_token");
// //     localStorage.removeItem("expires_at");
// //     localStorage.removeItem("scopes");
// //
// //     this.userProfile = null;
// //     this.auth0.logout({
// //       clientID: "ZrLE9o3S1k5gTb1wK4U73rnsgNVNHpSK",
// //       returnTo: "http://localhost:3000"
// //     });
// //   };
// //
// //   getAccessToken = () => {
// //     const accessToken = localStorage.getItem("access_token");
// //     if (!accessToken) {
// //       throw new Error("No access token found.");
// //     }
// //     return accessToken;
// //   };
// //
// //   getProfile = cb => {
// //     if (this.userProfile) return cb(this.userProfile);
// //     this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
// //       if (profile) this.userProfile = profile;
// //       cb(profile, err);
// //     });
// //   };
// //   userHasScopes(scopes) {
// //     const grantedScopes = (
// //         JSON.parse(localStorage.getItem("scopes")) || ""
// //     ).split(" ");
// //     return scopes.every(scope => grantedScopes.includes(scope));
// //   }
// // }
// //
// import auth0 from "auth0-js";
//
// const REDIRECT_ON_LOGIN = "redirect_on_login";
//
// // Stored outside class since private
// // eslint-disable-next-line
// let _idToken = null;
// let _accessToken = null;
// let _scopes = null;
// let _expiresAt = null;
//
// export default class Auth {
//   constructor(history) {
//     this.history = history;
//     this.userProfile = null;
//     this.requestedScopes = "openid dashboard ";
//     this.auth0 = new auth0.WebAuth({
//       domain: "rathireactjsconsulting-dev.auth0.com",
//       clientID: "vTzlSP6tw5Brf0v4Le2CCPRXoXATvg88",
//        redirectUri: "http://localhost:3000/callback",
//      audience:"http://localhost:8081",
//       responseType: "token id_token",
//       scope: this.requestedScopes
//     });
//   }
//
//   login = () => {
//     localStorage.setItem(
//         REDIRECT_ON_LOGIN,
//         JSON.stringify(this.history.location)
//     );
//     this.auth0.authorize();
//   };
//
//   handleAuthentication = () => {
//     this.auth0.parseHash((err, authResult) => {
//       if (authResult && authResult.accessToken && authResult.idToken) {
//         this.setSession(authResult);
//         const redirectLocation =
//             localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined"
//                 ? "/"
//                 : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));
//         this.history.push(redirectLocation);
//       } else if (err) {
//         this.history.push("/");
//         alert(`Error: ${err.error}. Check the console for further details.`);
//         console.log(err);
//       }
//       localStorage.removeItem(REDIRECT_ON_LOGIN);
//     });
//   };
//
//   setSession = authResult => {
//     console.log(authResult);
//     // set the time that the access token will expire
//     _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
//
//     // If there is a value on the `scope` param from the authResult,
//     // use it to set scopes in the session for the user. Otherwise
//     // use the scopes as requested. If no scopes were requested,
//     // set it to nothing
//     _scopes = authResult.scope || this.requestedScopes || "";
//
//     _accessToken = authResult.accessToken;
//     _idToken = authResult.idToken;
//     this.scheduleTokenRenewal();
//   };
//
//   isAuthenticated() {
//     return new Date().getTime() < _expiresAt;
//   }
//
//   logout = () => {
//     this.auth0.logout({
//       clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
//       returnTo: "http://localhost:3000"
//     });
//   };
//
//   getAccessToken = () => {
//     if (!_accessToken) {
//       throw new Error("No access token found.");
//     }
//     return _accessToken;
//   };
//
//   getProfile = cb => {
//     if (this.userProfile) return cb(this.userProfile);
//     this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
//       console.log('PROFILE', profile.nickname);
//       if (profile) this.userProfile = profile;
//       cb(profile, err);
//     });
//   };
//
//   userHasScopes(scopes) {
//     const grantedScopes = (_scopes || "").split(" ");
//     console.log('the scope are',grantedScopes);
//     console.log('the scope are',scopes);
//     return scopes.every(scope => grantedScopes.includes(scope));
//   }
//
//   renewToken(cb) {
//     this.auth0.checkSession({}, (err, result) => {
//       if (err) {
//         console.log(`Error: ${err.error} - ${err.error_description}.`);
//       } else {
//         this.setSession(result);
//       }
//       if (cb) cb(err, result);
//     });
//   }
//
//   scheduleTokenRenewal() {
//     const delay = _expiresAt - Date.now();
//     if (delay > 0) setTimeout(() => this.renewToken(), delay);
//   }
// }

import auth0 from "auth0-js";
const REDIRECT_ON_LOGIN = "redirect_on_login";
export default class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.requestedScopes = "openid profile email read:account  update:account delete:account post:account";
    this.auth0 = new auth0.WebAuth({
      domain: "rathireactjsconsulting-dev.auth0.com",
      clientID: "vTzlSP6tw5Brf0v4Le2CCPRXoXATvg88",
      redirectUri: "http://localhost:3000/callback",
      audience:"http://localhost:8081",

      responseType: "token id_token",
      scope:this.requestedScopes
    });
  }

  login = () => {
    console.log('IAM IN LOGIN');
    localStorage.setItem(
        REDIRECT_ON_LOGIN,
        JSON.stringify(this.history.location)
    );
    this.auth0.authorize();
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        const redirectLocation =
            localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined"
                ? "/"
                : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));
        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push("/");
        alert(`Error: ${err.error}. Check the console for further details.`);
        console.log(err);
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };


  // handleAuthentication = () => {
  //   console.log('iAM IN HANDLE AUTHENTICATE');
  //   this.auth0.parseHash((err, authResult) => {
  //     if (authResult && authResult.accessToken && authResult.idToken) {
  //       this.setSession(authResult);
  //        this.history.push("//app/dashboard");
  //       // this.history.redirectUri("/app/dashboard");
  //     } else if (err) {
  //       this.history.push("/");
  //       alert(`Error: ${err.error}. Check the console for further details.`);
  //       console.log(err);
  //     }
  //   });
  // };

  setSession = authResult => {
    console.log('IAM IN SET SESSION');
    console.log(authResult);
    // set the time that the access token will expire
    const expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
    );
    const scopes = authResult.scope || this.requestedScopes || "";
    console.log('the expiration time', expiresAt);
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt)
    localStorage.setItem("scopes", JSON.stringify(scopes));
    this.scheduleTokenRenewal();
  };

  isAuthenticated = () =>  {
    console.log('IAM IN AUTHENTICATED');
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    console.log('ISAUTHENTICATED====>',new Date().getTime() < expiresAt);
    return new Date().getTime() < expiresAt;
  }
  logout = () => {
    console.log('IAM IN LOGOUT');
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("scopes");
    this.userProfile = null;
    this.auth0.logout({
      clientID: "vTzlSP6tw5Brf0v4Le2CCPRXoXATvg88",
      returnTo: "http://localhost:3000"
    });
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("No access token found.");
    }
    return accessToken;
  };
  getUserProfile = () => {
    console.log('IAM IN GET PROFILE MTD');
    this.auth0.client.userInfo(localStorage.getItem("access_token"), (err, profile) => {
      if (profile) this.userProfile = profile;
      console.log('THE USER PROFILE IS(IAM in AUTH) ====>',profile);
    });
  };
  renewToken() {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(`Error: ${err.error} - ${err.error_description}.`);
      } else {
        this.setSession(result);
      }
      // if (cb) cb(err, result);
    });
  }
  getProfile = cb => {
    console.log('IAM IN GET PROFILE MTD');
    if (this.userProfile) return cb(this.userProfile);
    this.auth0.client.userInfo(localStorage.getItem("access_token"), (err, profile) => {
      if (profile) this.userProfile = profile;
      console.log('THE USER PROFILE IS(IAM in AUTH) ====>',profile);
      cb(profile, err);
    });
  };
  scheduleTokenRenewal() {
    const delay = localStorage.getItem("expires_at") - Date.now();
    if (delay > 0) setTimeout(() => this.renewToken(), delay);
  }
  userHasScopes(scopes) {
    const grantedScopes = (
        JSON.parse(localStorage.getItem("scopes")) || ""
    ).split(" ");
    return scopes.every(scope => grantedScopes.includes(scope));
  }
}

// auth0|5e803875918ec30cb148b926
// "email": "rathi@reactjsconsulting.com",
//     "email_verified": false,
// google-oauth2|103789031743090654768
