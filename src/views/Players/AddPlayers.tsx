import React, { Component, ReactNode, FormEvent, createRef } from "react";
import { Dispatch } from "redux";
import { actionCreators, PlayerActionTypes } from "store/ducks/players";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

interface DispatchToProps {
  onAddPlayers(players: string[]): void;
}

type AddPlayersProps = DispatchToProps;

class AddPlayers extends Component<AddPlayersProps> {
  playersInput = createRef<HTMLTextAreaElement>();

  onSubmit = (e: FormEvent): void => {
    const { onAddPlayers } = this.props;
    e.preventDefault();
    onAddPlayers(this.playersInput.current.value.split(","));
  };

  render(): ReactNode {
    return (
      <div>
        <h2>Escreva o nome dos jogadores separados por vírgulas</h2>
        <form onSubmit={this.onSubmit}>
          <textarea
            style={{ width: "100%", minHeight: "60px" }}
            ref={this.playersInput}
            name="players"
            cols={3}
            rows={5}
          />
          <button type="submit">Adicionar</button>
        </form>
        <Link to="/players/list">Ir para lista</Link>
      </div>
    );
  }
}

export { AddPlayers };

const mapDispatchToProps = (
  dispatch: Dispatch<PlayerActionTypes>,
): DispatchToProps => ({
  onAddPlayers: (players: string[]): PlayerActionTypes =>
    dispatch(actionCreators.addPlayers(players)),
});

export default connect(
  null,
  mapDispatchToProps,
)(AddPlayers);
