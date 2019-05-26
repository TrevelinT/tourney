import { createSelector, Selector } from "reselect";
import { APP_NAME } from "config";
import { Store, Dispatch, Action } from "redux";
import { v4 } from "uuid";
import { schema, normalize } from "normalizr";
import { actionCreators as stageActionCreators } from "store/ducks/stages";
import { createAllRounds, shuffle } from "helpers/tourney";

// Actions
const CREATE = `${APP_NAME}/rounds/CREATE`;
const HYDRATE = `${APP_NAME}/rounds/HYDRATE`;
const SELECT_ROUND = `${APP_NAME}/rounds/SELECT_ROUND`;

// Rounds with and without stages

// Interfaces
export interface Round {
  readonly id: string;
  fights: number[][];
}

interface RoundIndexedDictionary {
  [id: string]: Round;
}

interface RoundsState {
  allIds: string[];
  byId: RoundIndexedDictionary;
  selectedId: string;
  selectedStageType: string;
  remainingIds: string[];
}

interface RoundsPayload {
  rounds: number;
}

interface CreateRoundsAction {
  type: typeof CREATE;
  payload: RoundsPayload;
  meta?: object;
}

interface SelectPayload {
  stageType: string | null;
}

interface SelectRoundAction {
  type: typeof SELECT_ROUND;
  payload: SelectPayload;
}

interface HydrationPayload {
  result: {
    rounds: string[];
  };
  entities: {
    rounds: RoundIndexedDictionary;
  };
}

interface HydrateRoundsAction {
  type: typeof HYDRATE;
  payload: HydrationPayload;
}

export type RoundActionTypes =
  | CreateRoundsAction
  | SelectRoundAction
  | HydrateRoundsAction;

// Action creators
// Use FSA to keep a pattern
// https://github.com/redux-utilities/flux-standard-action
const createRounds = (rounds: number): RoundActionTypes => ({
  type: CREATE,
  payload: {
    rounds,
  },
});

const hydratePlayers = (payload: HydrationPayload): RoundActionTypes => ({
  type: HYDRATE,
  payload,
});

const selectRound = (stageType: string | null): RoundActionTypes => ({
  type: SELECT_ROUND,
  payload: {
    stageType,
  },
});

export const actionCreators = {
  createRounds,
  selectRound,
  hydratePlayers,
};

// Selectors (get a slice of the state)
const getSelectedRound = (state: any): string => state.rounds.selectedId;
const getSelectedStageType = (state: any): string =>
  state.rounds.selectedStageType;
const getRoundDictionary = (state: any): RoundIndexedDictionary =>
  state.rounds.byId;
const getRounds: Selector<any, Round> = createSelector(
  getRoundDictionary,
  getSelectedRound,
  (dictionary, id): Round => dictionary[id],
);

export const selectors = {
  getRounds,
  getSelectedStageType,
};

// Middleware
const roundMiddleware = (store: Store) => (next: Dispatch) => (
  action: Action,
) => {
  const { type } = action;
  if (type === SELECT_ROUND) {
    console.log("hi");
    const { payload: payloadType } = action as SelectRoundAction;
    if (payloadType.stageType != null) {
      console.log("hi2");
      store.dispatch(
        stageActionCreators.selectStages(
          payloadType.stageType,
          store.getState().players.allIds.length,
        ),
      );
      return next(action);
    }
  }
  if (type !== CREATE) {
    return next(action);
  }
  const {
    payload: { rounds },
  } = action as CreateRoundsAction;
  let allRounds = shuffle(createAllRounds(rounds).map(shuffle)).map(
    currentRound => ({
      id: v4(),
      fights: currentRound,
    }),
  );
  const round = new schema.Entity("rounds");
  const roundList = { rounds: [round] };
  const normalized = normalize({ rounds: allRounds }, roundList);
  store.dispatch(hydratePlayers(normalized));
};

export const middleware = {
  roundMiddleware,
};

// State and reducer
const initialState: RoundsState = {
  allIds: [],
  byId: {},
  selectedId: null,
  selectedStageType: null,
  remainingIds: [],
};

const reducer = (
  state = initialState,
  action: RoundActionTypes,
): RoundsState => {
  const { type, payload } = action;
  switch (type) {
    case HYDRATE:
      const { result, entities } = payload as HydrationPayload;
      return {
        ...state,
        allIds: result.rounds,
        byId: entities.rounds,
      };
    case SELECT_ROUND:
      const { stageType: selectedStageType } = payload as SelectPayload;
      const { allIds, remainingIds } = state;
      const ids = remainingIds.length ? remainingIds : allIds;
      return {
        ...state,
        selectedId: ids[0],
        remainingIds: ids.slice(1),
        selectedStageType,
      };
    default:
      return state;
  }
};

export default reducer;
