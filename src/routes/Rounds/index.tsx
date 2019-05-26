import React, { Component, ReactNode } from "react";
import { match, Switch, Route, Redirect } from "react-router";
import SelectRoundsContainer from "views/Rounds/SelectRounds";
import ListRoundsContainer from "views/Rounds/ListRounds";

interface RoundsRouteProps {
  match: match;
}

export default class RoundsRoute extends Component<RoundsRouteProps, {}> {
  render(): ReactNode {
    console.log("Rounds", this.props);
    const {
      match: { path, url },
    } = this.props;
    return (
      <Switch>
        <Route path={`${path}/select`} component={SelectRoundsContainer} />
        <Route path={`${path}/list`} component={ListRoundsContainer} />
        <Route
          path={`${path}`}
          exact
          render={(): ReactNode => <Redirect to={`${url}/select`} />}
        />
      </Switch>
    );
  }
}
