import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
BrowserRouter
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Sales from "../../pages/sales";
import Tables from "../../pages/tables";
import Purchase from "../../pages/purchase";
import Reports from "../../pages/reports";
import Product from "../../pages/product";
import Creditor from "../../pages/creditor";
import Customer from "../../pages/customer";
import Account from "../../pages/account";
import Petty from "../../pages/petty";
import Auth from "../../context/Auth";
import Callback from "../../context/Callback";

// context
import { useLayoutState } from "../../context/LayoutContext";
function Layout(props) {
  var classes = useStyles();
  const auth = new Auth(props.history);
  const accessToken = localStorage.getItem("access_token");
  // global
   var layoutState = useLayoutState();

console.log('the auth instance (local storage)IN LAYOUT COMPONENT',props.auth,accessToken);
  return (
    <div className={classes.root}>
        <>
          <Header auth = {props.auth} history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route
                  path="/callback"
                  render={props => <Callback auth={auth} {...props} />}
              />
              <Route path="/app/dashboard" component={Dashboard} />
              <Route path="/app/typography" component={Typography} />
              <Route path="/app/tables" component={Tables} />
              <Route path="/app/notifications" component={Notifications} />
              <Route
                  exact
                  path="/app/forms"
                  render={(props) =>  <Redirect to="/app/forms/product" /> }
              />
              {!!localStorage.getItem("access_token") ?  <Route path="/app/forms/product" component={Product} />:
                  <Redirect to="/app/typography"  />}
              <Route path="/app/forms/creditor" component={Creditor} />
              <Route path="/app/forms/customer" component={Customer} />
              <Route path="/app/forms/account" component={Account} />
              <Route path="/app/forms/petty" component={Petty} />

              <Route
                exact
                path="/app/reports"
                render={(props) => <Redirect to="/app/reports/reports" /> }
                />
              {!!localStorage.getItem("access_token") ? <Route path="/app/reports/sales" component={Sales} />:
                  <Redirect to="/app/typography"  />}

              <Route path="/app/reports/purchase" component={Purchase} />
              <Route path="/app/reports/reports" component={Reports} />


            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
