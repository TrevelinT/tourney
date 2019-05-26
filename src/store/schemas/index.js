import { schema } from 'normalizr';

const { Entity } = schema;

// Players
const player = new Entity(['players']);
const playerList = { players: [player] };

// Scenarios
const scenario = new Entity(['scenarios']);
const scenarioList = { scenarios: [scenario] };

// Fights
const fight = new Entity(['fights'], { players: playerList, scenario });
const fightList = { fights: [fight] };

// Categories
const category = new Entity(['categories'], { fights: fightList });
const categoryList = { categories: [category] };

export {
    playerList,
    scenarioList,
    fightList,
    categoryList,
};