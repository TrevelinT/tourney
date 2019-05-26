const createNewRound = (round: number, numberOfPlayers: number): number[][] => {
  const pairs = [];

  for (var i = 1; i <= numberOfPlayers / 2; i += 1) {
    if (i == 1) {
      pairs.push([
        1,
        ((round + numberOfPlayers - i - 1) % (numberOfPlayers - 1)) + 2,
      ]);
    } else {
      pairs.push([
        ((round + i - 2) % (numberOfPlayers - 1)) + 2,
        ((round + numberOfPlayers - i - 1) % (numberOfPlayers - 1)) + 2,
      ]);
    }
  }

  return pairs;
};

const createAllRounds = (numberOfPlayers: number): number[][][] => {
  const rounds = [];

  for (var round = 1; round < numberOfPlayers; round += 1) {
    rounds.push(createNewRound(round, numberOfPlayers));
  }

  return rounds;
};

const shuffle = (array: any[]): any[] => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

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
};

export { createAllRounds, shuffle };
