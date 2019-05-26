// import scenarios from './database/scenarios';
// import categories from './database/categories';
const scenarios = require('./database/scenarios');
const categories = require('./database/categories');

// Use this delay to simulate a backend
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getStages = () => ({ scenarios });

const getCategories = () => ({ categories });

const selectStage = (stages, type) => {
    const stagesCopy = stages.slice();
    const index = stagesCopy.findIndex(stage => stage.type === type);
    const foundStage = stagesCopy.splice(index, 1);

    return {
        selectedStage: foundStage,
        remainingStages: stagesCopy,
    }
}

// Create here the tourney logic
const createAllRounds = (numberOfPlayers) => {
    const rounds = [];
    
    for(var round = 1; round < numberOfPlayers; round += 1) {
      rounds.push (createNewRound(round, numberOfPlayers))
    }
    
    return rounds;
  }
  
  const createNewRound = (round, numberOfPlayers) => {
    const pairs = [];
  
    for (var i = 1; i <= numberOfPlayers/2; i += 1) {
      if (i==1) {
        pairs.push([1, (round + numberOfPlayers - i - 1) % (numberOfPlayers - 1) + 2])
      } else {
        pairs.push([(round + i - 2) % (numberOfPlayers - 1) + 2, (round + numberOfPlayers - i - 1) % (numberOfPlayers - 1) + 2])
      }
    }
    
    return pairs;
  }
  
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  // implement prettier, eslint and editorconfig
  // https://stackoverflow.com/questions/48363647/editorconfig-vs-eslint-vs-prettier-is-it-worthwhile-to-use-them-all

  const createTournament = (players) => {
      const allPlayers = players.length % 2 === 0 ? players : players.concat([{ name: 'Bye' }]);
      const numberOfPlayers = allPlayers.length;
      const allRounds = shuffle(createAllRounds(numberOfPlayers).map(shuffle));
      let allStages = shuffle(scenarios);
      const allCategories = categories.map((category, index) => {
          const round = allRounds[index];
          return {
              ...category,
              fights: round.map(fight => {
                const { selectedStage, remainingStages } = selectStage(allStages, category.scenarioType);
                allStages = remainingStages;

                return {
                    players: fight.map(number => allPlayers[number - 1]),
                    stage: selectedStage,
                };
                  
              }),
          }
      });

      return allCategories;
  }
  
  const players = [{ name: 'DMT'}, { name: 'DAN'}, { name: 'TRIPA'}, { name: 'HENRY'}, { name: 'GLEIS'}];
  const tournament = createTournament(players);
  console.log(JSON.stringify(tournament, null, 2));
// To become easier to extract the logic to a back-end later

// need to create in client the logic of recapture (repescagem!!!)
// Think about free 4 all (8 player) and doubles with random teams ()