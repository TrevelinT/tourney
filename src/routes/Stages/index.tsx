import React, { Component, ReactNode } from "react";
import { match, Switch, Route, Redirect } from "react-router";
import SelectStagesContainer from "views/Stages/SelectStages";
import ListStagesContainer from "views/Stages/ListStages";

interface StagesRouteProps {
  match: match;
}

export default class StagesRoute extends Component<StagesRouteProps, {}> {
  render(): ReactNode {
    console.log("stages", this.props);
    const {
      match: { path, url },
    } = this.props;
    return (
      <Switch>
        <Route path={`${path}/select`} component={SelectStagesContainer} />
        <Route path={`${path}/list`} component={ListStagesContainer} />
        <Route
          path={`${path}`}
          exact
          render={(): ReactNode => <Redirect to={`${url}/select`} />}
        />
      </Switch>
    );
  }
}
