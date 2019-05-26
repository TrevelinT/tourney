import React, { Component, ReactNode } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Players from "../Players";
import Stages from "../Stages";
import Rounds from "../Rounds";

export default class AppRouter extends Component {
  render(): ReactNode {
    return (
      <Router>
        <ul>
          <li>
            <Link to="/players/list">Lista de jogadores</Link>
          </li>
          <li>
            <Link to="/stages/list">Lista de cenarios</Link>
          </li>
          <li>
            <Link to="/rounds/list">Lista de rounds</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/players/add">Adicionar jogadores</Link>
          </li>
          <li>
            <Link to="/stages/select">Escolher cenarios</Link>
          </li>
          <li>
            <Link to="/rounds/select">Escolher rounds</Link>
          </li>
        </ul>
        <Switch>
          <Route path="/players" component={Players} />
          <Route path="/stages" component={Stages} />
          <Route path="/rounds" component={Rounds} />
        </Switch>
      </Router>
    );
  }
}
