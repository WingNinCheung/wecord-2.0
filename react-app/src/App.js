import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import NavBar from "./components/NavBar/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/HomePage/PublicServers/ServerList";
import HomePage from "./components/HomePage";
import { authenticate } from "./store/session";
import CreateForm from "./components/HomePage/createServer";

import CreateChannel from "./components/HomePage/Channel/createChannel";
import Splash from "./components/Splash/splash";
import FriendsList from "./components/friends/friends";

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true}>
          <Splash />
        </Route>
        <NavBar />
      </Switch>
      <Switch>
        <ProtectedRoute path="/publicservers" exact={true}>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path="/home" exact={true}>
          <HomePage />
        </ProtectedRoute>
        <ProtectedRoute path="/create-server" exact={true}>
          <CreateForm />
        </ProtectedRoute>
        <ProtectedRoute path="/:serverId/channels/create" exact={true}>
          <CreateChannel />
        </ProtectedRoute>
        <ProtectedRoute path="/friends" exact={true}>
          <FriendsList />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
