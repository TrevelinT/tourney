import React, { Component, ReactNode } from "react";
import { selectors, Player } from "store/ducks/players";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import { RoundActionTypes, actionCreators } from "store/ducks/rounds";

interface StateToProps {
  players: Player[];
}

interface DispatchToProps {
  onCreateRounds(rounds: number): void;
}

type ListPlayersProps = StateToProps & DispatchToProps;

class ListPlayers extends Component<ListPlayersProps> {
  handleCreateRounds = (): void => {
    const { onCreateRounds, players } = this.props;
    onCreateRounds(players.length);
  };

  render(): ReactNode {
    const { players } = this.props;
    return (
      <div>
        <h2>Jogadores</h2>
        <ul>
          {players.map(
            (player): ReactNode => (
              <li key={player.id}>
                <p>
                  {player.name} <strong>{player.num}</strong>
                </p>
              </li>
            ),
          )}
        </ul>
        <button type="button" onClick={this.handleCreateRounds}>
          Criar rounds
        </button>
        <Link to="/rounds/select">Selecionar rounds</Link>
      </div>
    );
  }
}

export { ListPlayers };

const mapStateToProps = (state: any): StateToProps => ({
  players: selectors.getPlayers(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<RoundActionTypes>,
): DispatchToProps => ({
  onCreateRounds: (rounds: number): RoundActionTypes =>
    dispatch(actionCreators.createRounds(rounds)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListPlayers);
