let { google } = require("googleapis");
const fs = require("fs");
const authentication = require("./google-authentication");
const getSheetNames = require("./sheet-char-names"); //promise
const getCharacterSheetData = require("./sheet-char-data");

// authentication.then(auth =>
//   getSheetNames(auth).then(data => {
//     console.log(data);
//   })
// );

const wait = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

const makeCharactersJson = async auth => {
  let characterSheetNames = await getSheetNames(auth);

  const results = await characterSheetNames.reduce(async (charListP, char) => {
    const charList = await charListP; //await the res of the preomose of the previous iteration
    await wait(500);
    const response = await getCharacterSheetData(
      auth,
      encodeURIComponent(char)
    );
    return charList.concat([response]);
  }, []);

  console.log(results);
};

module.exports = authentication.then(auth => makeCharactersJson(auth));
