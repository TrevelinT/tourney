import { combineReducers } from "redux";
import playerReducer from "../ducks/players";
import stagesReducer from "../ducks/stages";
import roundsReducer from "../ducks/rounds";

const rootReducer = combineReducers({
  players: playerReducer,
  stages: stagesReducer,
  rounds: roundsReducer,
});

export default rootReducer;
