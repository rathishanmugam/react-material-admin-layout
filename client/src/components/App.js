import React, {useState} from "react";
import { HashRouter,BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { withRouter } from 'react-router';
// components
import Layout from "./Layout";
import Dashboard from "../pages/dashboard";
import { useHistory } from 'react-router-dom';
// pages
import Error from "../pages/error";
import Login from "../pages/login";

// context
import { useUserState } from "../context/UserContext";
import Callback from "../context/Callback";
import Auth from "../context/Auth";

export default function App() {
  // var { isAuthenticated } = useUserState();
    let history = useHistory();
    const auth = new Auth(history);
    auth.renewToken();
    console.log('the auth instance',auth);
    const { isAuthenticated, login, logout,userHasScopes } = auth;

    return (
    <BrowserRouter>
      <Switch>
          {/*<Route exact path="/" component={Dashboard} />*/}

          <Route exact path="/" render={() => <Redirect to="/app/dashboard" />} />
        <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/dashboard" />}

        />
        />
        <PrivateRoute auth={auth}  path="/app" component={Layout} />
          <Route
              path="/callback"
              render={props => <Callback auth={auth} {...props} />}
          />
        {/*<PublicRoute path="/login" component={Login} />*/}
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );

  // #######################################################################

  function PrivateRoute({ component,auth, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/app",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
