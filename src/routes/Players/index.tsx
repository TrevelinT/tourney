import React, { Component, ReactNode } from "react";
import { match, Switch, Route, Redirect } from "react-router";
import AddPlayersContainer from "views/Players/AddPlayers";
import ListPlayersContainer from "views/Players/ListPlayers";

interface PlayersRouteProps {
  match: match;
}

export default class PlayersRoute extends Component<PlayersRouteProps, {}> {
  render(): ReactNode {
    console.log(this.props);
    const {
      match: { path, url },
    } = this.props;
    return (
      <Switch>
        <Route path={`${path}/add`} component={AddPlayersContainer} />
        <Route path={`${path}/list`} component={ListPlayersContainer} />
        <Route
          path={`${path}`}
          exact
          render={(): ReactNode => <Redirect to={`${url}/add`} />}
        />
      </Switch>
    );
  }
}
