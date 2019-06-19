const fs = require("fs");
const authentication = require("./google-authentication");
const getSheetNames = require("./sheet-char-names");
const getCharacterSheetData = require("./sheet-char-data");

const wait = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

const makeCharactersJson = async auth => {
  let characterSheetNames = await getSheetNames(auth);

  let newChars = characterSheetNames.slice(1);

  const results = await newChars.reduce(async (charListP, char, i) => {
    const charList = await charListP; //await the res of the promise of the previous iteration
    await wait(1000);
    const response = await getCharacterSheetData(
      auth,
      encodeURIComponent(char)
    );
    return charList.concat([response]); //arrays are merged
  }, []);

  const fixedMoveNames = {
    "<-Which hitbox?": "hitbox"
  };

  const structuredResults = results.map((character, i) => {
    let charName = characterSheetNames[i + 1];
    let moveProperties = character[0].slice(1); // ["", "startup", "landing lag", "total frames"];
    let rawMoves = character.slice(1);

    let movesData = rawMoves.reduce((acc, move, i) => {
      //move looks like ["jab1", 19, 5, 24];
      let noMoveName = move.slice(1);
      let moveData = noMoveName.reduce((allProps, currProp, i) => {
        //Here we see if the current move property name is in our renaming table, if so we used the alternate
        moveProperty =
          moveProperties[i] in fixedMoveNames
            ? fixedMoveNames[moveProperties[i]]
            : moveProperties[i];

        allProps[moveProperty] = currProp;
        return allProps;
      }, {});
      acc[move[0]] = moveData;
      return acc;
    }, {});
    return {
      name: charName,
      moves: movesData
    };
  });

  structuredResults.map(el => {
    const characterFileName = el.name
      .split(" ")
      .join("")
      .replace(/[/]/g, "_");
    fs.writeFile(
      `${__dirname}/../data/${characterFileName}.json`,
      JSON.stringify(el, { flag: "wx" }, 2),
      err => {
        if (err) throw err;

        console.log(`file created for ${characterFileName}`);
      }
    );
  });
};

module.exports = authentication.then(auth => makeCharactersJson(auth));
