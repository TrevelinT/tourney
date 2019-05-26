import React, { Component, ReactNode } from "react";
import { selectors, Stage } from "store/ducks/stages";
import { connect } from "react-redux";

interface StateToProps {
  stages: Stage[];
}

type ListStagesProps = StateToProps;

class ListStages extends Component<ListStagesProps> {
  render(): ReactNode {
    const { stages } = this.props;
    return (
      <div>
        <h2>Estágios</h2>
        <ul>
          {stages.map(
            (stage): ReactNode => (
              <li key={stage.id}>
                <p>{stage.name} </p>
                <span>{stage.type}</span>
              </li>
            ),
          )}
        </ul>
      </div>
    );
  }
}

export { ListStages };

const mapStateToProps = (state: any): StateToProps => ({
  stages: selectors.getStages(state),
});

export default connect(mapStateToProps)(ListStages);
