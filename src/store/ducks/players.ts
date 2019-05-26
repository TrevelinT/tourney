import { createSelector, Selector } from "reselect";
import { APP_NAME } from "config";
import { Store, Dispatch, Action } from "redux";
import { v4 } from "uuid";
import { schema, normalize } from "normalizr";
import { shuffle } from "helpers/tourney";

// Actions
const ADD = `${APP_NAME}/players/ADD`;
const HYDRATE = `${APP_NAME}/players/HYDRATE`;
const ADD_POINTS = `${APP_NAME}/players/ADD_POINTS`;

// Interfaces
export interface Player {
  readonly id: string;
  readonly type: string;
  name: string;
  points: number;
  num?: number;
}

interface PlayerIndexedDictionary {
  [id: string]: Player;
}

interface PlayersState {
  allIds: string[];
  byId: PlayerIndexedDictionary;
}

interface PlayersPayload {
  players: string[];
}

interface AddPlayersAction {
  type: typeof ADD;
  payload: PlayersPayload;
  meta?: object;
}

interface PointsPayload {
  player: string;
  points: number;
}

interface AddPointsAction {
  type: typeof ADD_POINTS;
  payload: PointsPayload;
}

interface HydrationPayload {
  result: {
    players: string[];
  };
  entities: {
    players: PlayerIndexedDictionary;
  };
}

interface HydratePlayersAction {
  type: typeof HYDRATE;
  payload: HydrationPayload;
}

export type PlayerActionTypes =
  | AddPlayersAction
  | AddPointsAction
  | HydratePlayersAction;

// Action creators
// Use FSA to keep a pattern
// https://github.com/redux-utilities/flux-standard-action
const addPlayers = (players: string[]): PlayerActionTypes => ({
  type: ADD,
  payload: {
    players,
  },
});

const hydratePlayers = (payload: HydrationPayload): PlayerActionTypes => ({
  type: HYDRATE,
  payload,
});

const addPointsToPlayer = (
  player: string,
  points: number,
): PlayerActionTypes => ({
  type: ADD_POINTS,
  payload: {
    player,
    points,
  },
  meta: { normalize: true },
});

export const actionCreators = {
  addPlayers,
  addPointsToPlayer,
  hydratePlayers,
};

// Selectors (get a slice of the state)
const getPlayerList = (state: any): string[] => state.players.allIds;
const getPlayerDictionary = (state: any): PlayerIndexedDictionary =>
  state.players.byId;
const getPlayers: Selector<any, Player[]> = createSelector(
  getPlayerDictionary,
  getPlayerList,
  (dictionary, ids): Player[] =>
    ids.map((id: string): Player => dictionary[id]),
);

export const selectors = {
  getPlayers,
};

// Middleware
const playerMiddleware = (store: Store) => (next: Dispatch) => (
  action: Action,
) => {
  const { type } = action;
  if (type !== ADD) {
    return next(action);
  }
  const {
    payload: { players },
  } = action as AddPlayersAction;
  let allPlayers = players.map(
    (player: string): Player => ({
      id: v4(),
      name: player,
      type: "human",
      points: 0,
    }),
  );
  if (players.length % 2 !== 0) {
    allPlayers = allPlayers.concat({
      id: v4(),
      name: "Bye",
      type: "computer",
      points: 0,
    });
  }
  allPlayers = shuffle(allPlayers).map((player: Player, index: number) => ({
    ...player,
    num: index + 1,
  }));
  const player = new schema.Entity("players");
  const playerList = { players: [player] };
  const normalized = normalize({ players: allPlayers }, playerList);
  store.dispatch(hydratePlayers(normalized));
};

export const middleware = {
  playerMiddleware,
};

// State and reducer
const initialState: PlayersState = {
  allIds: [],
  byId: {},
};

const reducer = (
  state = initialState,
  action: PlayerActionTypes,
): PlayersState => {
  const { type, payload } = action;
  switch (type) {
    case HYDRATE:
      const { result, entities } = payload as HydrationPayload;
      return {
        allIds: result.players,
        byId: entities.players,
      };
    case ADD_POINTS:
      const { points, player } = payload as PointsPayload;
      const selectedPlayer = state.byId[player];
      return {
        ...state,
        byId: {
          ...state.byId,
          [player]: {
            ...selectedPlayer,
            points: selectedPlayer.points += points,
          },
        },
      };
    default:
      return state;
  }
};

export default reducer;
