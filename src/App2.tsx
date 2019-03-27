import React, { useState } from "react";

import { StatsController } from "./components/StatsController";
import { StatusBar } from "./components/StatusBar";
import { NavigationFooter } from "./components/NavigationFooter";
import { browserHistory } from "./history";
import { Router, Route, Switch } from "react-router-dom";
import { PlaceController } from "./components/PlaceController";
import { UserController } from "./components/UserController";
import { useGoogleAuth } from "./useGoogleAuth";
import { User, emptyUser } from "./types";
import { UserContext } from "./customHooks/useUserContext";

declare global {
  interface Window {
    gapi: any;
  }
}

export const App2: React.FC = () => {
  const [error, setError] = useState<Error | null | string>(null);
  const { user, signOut, authorize } = useGoogleAuth();

  if (!user) {
    return (
      <>
        <h1>Authorise google to use this page.</h1>
        <input onClick={authorize} type="button" value="Authorize!" />
      </>
    );
  }

  return (
    <UserContext.Provider value={user}>
      <StatusBar logoutClicked={signOut} />
      <Router history={browserHistory}>
        <Switch>
          <Route exact path="/" component={StatsController} />
          <Route exact path="/ratings" component={StatsController} />
          <Route
            exact
            path="/me"
            component={UserController}
          />
          <Route
            exact
            path="/:placeId/:placeName"
            component={PlaceController}
          />
        </Switch>
      </Router>
      <NavigationFooter />
      {error && <h2>{error}</h2>}
    </UserContext.Provider>
  );
};
