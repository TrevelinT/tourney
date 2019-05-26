import React, { Component, ReactNode, FormEvent, createRef } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { actionCreators, RoundActionTypes } from "store/ducks/rounds";

interface DispatchToProps {
  onSelectRounds(type: string | null): void;
}

type SelectRoundsProps = DispatchToProps;

interface SelectRoundsState {
  showRoundRobin: boolean;
}

class SelectRounds extends Component<SelectRoundsProps, SelectRoundsState> {
  stageType = createRef<HTMLSelectElement>();
  stageQuantity = createRef<HTMLInputElement>();

  state = {
    showRoundRobin: false,
  };

  onSubmit = (e: FormEvent): void => {
    const { onSelectRounds } = this.props;
    const { value } = this.stageType.current;
    e.preventDefault();
    onSelectRounds(value === "none" ? null : value);
  };

  toggleRoundRobin = (): void => {
    this.setState((): SelectRoundsState => ({ showRoundRobin: true }));
  };

  render(): ReactNode {
    const { showRoundRobin } = this.state;
    return (
      <div>
        {!showRoundRobin ? (
          <div>
            <h2>Selecione o tipo de Round</h2>
            <button onClick={this.toggleRoundRobin}>Round Robin</button>
            <Link to="/stages/select">
              <button>Cenários apenas</button>
            </Link>
          </div>
        ) : (
          <div>
            <form onSubmit={this.onSubmit}>
              <select ref={this.stageType} name="stage-type" id="stage-type">
                <option value="" disabled>
                  Selecione o tipo de cenário
                </option>
                <option value="none">Nenhum</option>
                <option value="normal">Normal</option>
                <option value="hazardless">Sem hazards</option>
                <option value="omega-or-battlefield">
                  Omega ou Battlefield
                </option>
                <option value="all">Todos</option>
              </select>
              <button type="submit">Selecionar</button>
            </form>
            <Link to="/rounds/list">Ir para lista</Link>
          </div>
        )}
      </div>
    );
  }
}

export { SelectRounds };

const mapDispatchToProps = (
  dispatch: Dispatch<RoundActionTypes>,
): DispatchToProps => ({
  onSelectRounds: (type: string | null): RoundActionTypes =>
    dispatch(actionCreators.selectRound(type)),
});

export default connect(
  null,
  mapDispatchToProps,
)(SelectRounds);
