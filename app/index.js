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

const makeCharactersJson = async auth => {
  let characterSheetNames = await getSheetNames(auth);

  let characterData = characterSheetNames.map(
    async (char, i) => i !== 0 && (await getCharacterSheetData(auth, encodeURIComponent(char)))
  );

  console.log(characterSheetNames);
};

// getFeed().then(data => (vm.feed = data));

// async function myFunction() {
//   vm.feed = await getFeed();
//   // do whatever you need with vm.feed below
// }

module.exports = authentication.then(auth => makeCharactersJson(auth));
