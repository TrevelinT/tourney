import React, { Component, ReactNode } from "react";
import { selectors as roundSelectors } from "store/ducks/rounds";
import { selectors as playerSelectors, Player } from "store/ducks/players";
import { selectors as stageSelectors, Stage } from "store/ducks/stages";
import { connect } from "react-redux";

interface StateToProps {
  fights: Player[][];
  stageType: string;
  stages: Stage[];
}

type ListRoundsProps = StateToProps;

class ListRounds extends Component<ListRoundsProps> {
  render(): ReactNode {
    const { stages, stageType, fights } = this.props;
    return (
      <div>
        <h2>Round</h2>
        {stageType ? <h3>{`Tipo de cenário: ${stageType}`}</h3> : null}
        <ul>
          {fights.map(
            (players, index): ReactNode => (
              <li key={index}>
                <span>{players[0].name}</span>
                <span> vs </span>
                <span>{players[1].name}</span>
                {stageType ? <p>{`Cenario ${stages[index].name}`}</p> : null}
                {stageType ? <p>{`Cenario ${stages[index].type}`}</p> : null}
              </li>
            ),
          )}
        </ul>
      </div>
    );
  }
}

export { ListRounds };

const mapStateToProps = (state: any): StateToProps => {
  const round = roundSelectors.getRounds(state);
  const players = playerSelectors
    .getPlayers(state)
    .sort((a: Player, b: Player) => a.num - b.num);
  console.log(players);
  const fights = round.fights.map(
    (fight: number[]): Player[] =>
      fight.map((p: number): Player => players[p - 1]),
  );
  console.log(fights);
  const stageType = roundSelectors.getSelectedStageType(state);
  const stages = stageType ? stageSelectors.getStages(state) : [];

  return {
    fights,
    stageType,
    stages,
  };
};

export default connect(mapStateToProps)(ListRounds);
