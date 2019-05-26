import { createSelector, Selector } from "reselect";
import { APP_NAME } from "config";
import { schema, normalize } from "normalizr";
import stages from "api/fixtures/stages";
import { shuffle } from "helpers/tourney";

// Actions
const SELECT = `${APP_NAME}/stages/SELECT`;

// Interfaces
export interface Stage {
  readonly id: string;
  readonly type: string;
  name: string;
}

interface StageIndexedDictionary {
  [id: string]: Stage;
}

interface StagesState {
  allIds: string[];
  byId: StageIndexedDictionary;
  selectedIds: string[];
  remainingIds: string[];
  // selectedType here
  // chosen instead of selected
  // choose instead of select
}

interface StagePayload {
  type: string;
  quantity: number;
}

interface SelectStageAction {
  type: typeof SELECT;
  payload: StagePayload;
  meta?: object;
}

interface HydrationPayload {
  result: {
    stages: string[];
  };
  entities: {
    stages: StageIndexedDictionary;
  };
}

export type StageActionTypes = SelectStageAction;

// Action creators
// Use FSA to keep a pattern
// https://github.com/redux-utilities/flux-standard-action
const selectStages = (type: string, quantity: number): StageActionTypes => ({
  type: SELECT,
  payload: {
    type,
    quantity,
  },
});

export const actionCreators = {
  selectStages,
};

// Selectors (get a slice of the state)
// const getAllStages = (state: any): string[] => state.stages.allIds;
// const getRemainingStages = (state: any): string[] => state.stages.remainingIds;
const getSelectedStages = (state: any): string[] => state.stages.selectedIds;
const getStageDictionary = (state: any): StageIndexedDictionary =>
  state.stages.byId;
const getStages: Selector<any, Stage[]> = createSelector(
  getStageDictionary,
  getSelectedStages,
  (dictionary, ids): Stage[] => ids.map((id: string): Stage => dictionary[id]),
);

export const selectors = {
  getStages,
};

// State and reducer
const getInitialState = (stages: Stage[]): StagesState => {
  const stage = new schema.Entity("stages");
  const stageList = { stages: [stage] };
  const normalized = normalize({ stages: shuffle(stages) }, stageList);

  return {
    allIds: normalized.result.stages,
    byId: normalized.entities.stages,
    remainingIds: [],
    selectedIds: [],
  };
};

const initialState: StagesState = getInitialState(stages);

const reducer = (
  state = initialState,
  action: StageActionTypes,
): StagesState => {
  const { type, payload } = action;
  switch (type) {
    case SELECT:
      const { type: stageType, quantity } = payload;
      const { allIds, byId, remainingIds } = state;
      const ids = remainingIds.length ? remainingIds : allIds;

      const obj = ids.reduce(
        (acc, next): object => {
          const currentStage: Stage = byId[next];
          const isCurrentStageValid =
            (currentStage.type === stageType || stageType === "all") &&
            acc.selectedIds.length < quantity;
          return {
            selectedIds: isCurrentStageValid
              ? acc.selectedIds.concat(next)
              : acc.selectedIds,
            remainingIds: !isCurrentStageValid
              ? acc.remainingIds.concat(next)
              : acc.remainingIds,
          };
        },
        { selectedIds: [], remainingIds: [] },
      );
      return {
        ...state,
        ...obj,
      };
    default:
      return state;
  }
};

export default reducer;
