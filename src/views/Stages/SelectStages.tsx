import React, { Component, ReactNode, FormEvent, createRef } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { actionCreators, StageActionTypes } from "store/ducks/stages";

interface DispatchToProps {
  onSelectStages(type: string, quantity: number): void;
}

type SelectStagesProps = DispatchToProps;

class SelectStages extends Component<SelectStagesProps> {
  stageType = createRef<HTMLSelectElement>();
  stageQuantity = createRef<HTMLInputElement>();

  onSubmit = (e: FormEvent): void => {
    const { onSelectStages } = this.props;
    e.preventDefault();
    onSelectStages(
      this.stageType.current.value,
      parseInt(this.stageQuantity.current.value, 10),
    );
  };

  render(): ReactNode {
    return (
      <div>
        <h2>Selecione o tipo de estágio e a quantidade para sorteio</h2>
        <form onSubmit={this.onSubmit}>
          <select ref={this.stageType} name="stage-type" id="stage-type">
            <option value="" disabled>
              Selecione o tipo
            </option>
            <option value="normal">Normal</option>
            <option value="hazardless">Sem hazards</option>
            <option value="omega-or-battlefield">Omega ou Battlefield</option>
            <option value="all">Todos</option>
          </select>
          <div>
            <label htmlFor="stage-quantity">Escolha o número de estágios</label>
            <input ref={this.stageQuantity} id="stage-quantity" type="number" />
          </div>
          <button type="submit">Selecionar</button>
        </form>
        <Link to="/stages/list">Ir para lista</Link>
      </div>
    );
  }
}

export { SelectStages };

const mapDispatchToProps = (
  dispatch: Dispatch<StageActionTypes>,
): DispatchToProps => ({
  onSelectStages: (type: string, quantity: number): StageActionTypes =>
    dispatch(actionCreators.selectStages(type, quantity)),
});

export default connect(
  null,
  mapDispatchToProps,
)(SelectStages);
