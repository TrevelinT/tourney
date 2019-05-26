import { APP_NAME } from 'config';

// Actions
const ADD = `${APP_NAME}/categories/ADD`;
const CHANGE = `${APP_NAME}/categories/CHANGE`;

// Action creators
// Use FSA to keep a pattern
// https://github.com/redux-utilities/flux-standard-action
const addCategory = (category) => ({
    type: ADD,
    payload: {
        item: normalize(category, category),
    },
    meta: { normalize: true }
});

const changeCategory = (category) => ({
    type: CHANGE,
    payload: {
        category,
    },
});

// Selectors (get a slice of the state)
const getCategoriesEntity = state => state.entities.categories;
const getCategoriesIds = state => state.categories.items;
const getCurrentCategory = state => state.categories.current;
const getCategories = createSelector(
    [getCategoriesEntity, getCategoriesIds],
    (entities, ids) => ids.map(id => entities[id]),
);

// Operators (async actions / side effects)
const skipCategory = () => (dispatch, getState) => {
    const state = getState();
    const categoriesIds = getCategoriesIds(state);
    const currentCategory = getCurrentCategory(state);
    const currentCategoryIndex = categoriesIds.findIndex(category => category === currentCategory);
    const nextCategoryIndex = currentCategoryIndex + 1;

    if (nextCategoryIndex < categoriesIds.length) {
        dispatch(changeCategory(categoriesIds[nextCategoryIndex]));
    }
};

// State and reducer
const initialState = {
    items: [],
    current: '',
};

const reducer = (state = initialState, action = {}) => {
    switch(action.type) {
        case ADD:
            return [...state.items, action.payload.category];
        case SKIP:
            return action.payload.category;
        default:
            return state;
    }
};

export default reducer;

/*
state shape

{
    name: String
    points: Number
    position: Number
}
{
    entities: {
        21837128732873: {}
    }   
}
*/

