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

  let newChars = characterSheetNames.slice(1, 2);

  const results = await newChars.reduce(async (charListP, char, i) => {
    const charList = await charListP; //await the res of the promise of the previous iteration
    await wait(1000);
    const response = await getCharacterSheetData(
      auth,
      encodeURIComponent(char)
    );
    return charList.concat([response]); //arrays are merged
  }, []);

  //rawData is an array of arrays, the inside values are
  // from value 0, 1, 2, 3...
  //[Move Name, startup, total frames, landing lag, additional notes, base damage, shieldlag. shield stun, which hitbox, advantage]
  // Structure of data
  // [
  //   ["", "startup", "landing lag", "total frames"],
  //   ["jab1", 2, 19, 0],
  //   ["jab2", 6, 22, 81]
  // ];

  // let a1 = {
  //   name: "maro",
  //   moves: {
  //     jab1: {
  //       startup: 21,
  //       "landing lag": 6,
  //       "total frames": 27
  //     },
  //     jab2: {}
  //   }
  // };

  const structuredResults = results.map((char, i) => {
    let charName = characterSheetNames[i + 1];
    let moveProperties = char[0].slice(1); // ["", "startup", "landing lag", "total frames"];
    let rawMoves = char.slice(1);

    let movesData = rawMoves.reduce((acc, move, i) => {
      //move looks like ["jab1", 19, 5, 24];
      let noMoveName = move.slice(1);
      let moveData = noMoveName.reduce((allProps, moveVal, i) => {
        allProps[moveProperties[i]] = moveVal;
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

  console.log(structuredResults[0]);
};

module.exports = authentication.then(auth => makeCharactersJson(auth));

//example output for above (to reason about data transforms);
let maro = {
  name: "01 - Mario",
  moves: {
    "Jab 1": {
      Startup: "2",
      "Total Frames": "19",
      "Landing Lag": "",
      "Additional Notes": "Transitions to jab 2 as early as frame 5",
      "Base Damage": "2.2",
      Shieldlag: "8",
      Shieldstun: "3",
      "<-Which hitbox?": "",
      Advantage: "-14"
    },
    "Jab 2": {
      Startup: "2",
      "Total Frames": "21",
      "Landing Lag": "",
      "Additional Notes": "Transitions to Jab 3 as early as frame 6.",
      "Base Damage": "1.7",
      Shieldlag: "5",
      Shieldstun: "3",
      "<-Which hitbox?": "",
      Advantage: "-16"
    },
    "Jab 3": {
      Startup: "3",
      "Total Frames": "33",
      "Landing Lag": "",
      "Additional Notes": "",
      "Base Damage": "4.0",
      Shieldlag: "11",
      Shieldstun: "5",
      "<-Which hitbox?": "",
      Advantage: "-29"
    },
    "F-Tilt": {
      Startup: "5",
      "Total Frames": "25",
      "Landing Lag": "",
      "Additional Notes": "",
      "Base Damage": "7.0",
      Shieldlag: "7",
      Shieldstun: "7",
      "<-Which hitbox?": "",
      Advantage: "-13"
    },
    "U-Tilt": {
      Startup: "5",
      "Total Frames": "29",
      "Landing Lag": "",
      "Additional Notes": "",
      "Base Damage": "5.5",
      Shieldlag: "6",
      Shieldstun: "6",
      "<-Which hitbox?": "",
      Advantage: "-18"
    },
    "D-Tilt": {
      Startup: "5",
      "Total Frames": "27",
      "Landing Lag": "",
      "Additional Notes": "",
      "Base Damage": "7.0 / 5.0",
      Shieldlag: "7/6",
      Shieldstun: "7/6",
      "<-Which hitbox?": "Close/far",
      Advantage: "-15/-16"
    },
    "Dash Attack": {
      Startup: "6",
      "Total Frames": "37",
      "Landing Lag": "",
      "Additional Notes": "",
      "Base Damage": "8.0 / 6.0",
      Shieldlag: "9/8",
      Shieldstun: "14/11",
      "<-Which hitbox?": "Early/late",
      Advantage: "-17"
    },
    "F-Smash": {
      Startup: "15",
      "Total Frames": "47",
      "Landing Lag": "",
      "Additional Notes": "Charge hold frame is 5.",
      "Base Damage": "17.7 / 14.6",
      Shieldlag: "11/10",
      Shieldstun: "12/10",
      "<-Which hitbox?": "Far/Close",
      Advantage: "-22/-20"
    },
    "U-Smash": {
      Startup: "9",
      "Total Frames": "39",
      "Landing Lag": "",
      "Additional Notes":
        "Head Invulnerability on frame 9-12. Charge hold is frame 6",
      "Base Damage": "14.0",
      Shieldlag: "10",
      Shieldstun: "10",
      "<-Which hitbox?": "",
      Advantage: "-20"
    },
    "D-Smash": {
      Startup: "5/14",
      "Total Frames": "43",
      "Landing Lag": "",
      "Additional Notes": "Charge hold frame is 2",
      "Base Damage": "10.0 / 12.0",
      Shieldlag: "8/9",
      Shieldstun: "7/8",
      "<-Which hitbox?": "First/Second",
      Advantage: "-31/-21"
    },
    "N-Air": {
      Startup: "3",
      "Total Frames": "45",
      "Landing Lag": "6",
      "Additional Notes": "Auto cancels on frame 1-2 and frame 39 onward",
      "Base Damage": "8.0 / 5.0 ",
      Shieldlag: "7/6",
      Shieldstun: "4/3",
      "<-Which hitbox?": "Early/Late",
      Advantage: "-2/-3/-3/-3"
    },
    "F-Air": {
      Startup: "16",
      "Total Frames": "59",
      "Landing Lag": "17",
      "Additional Notes": "Auto cancels on frame 1-2 and frame 43 onward",
      "Base Damage": "14.0 / 12.0",
      Shieldlag: "10/9",
      Shieldstun: "5/5",
      "<-Which hitbox?": "Meteor/Early",
      Advantage: "-12/-12/-12/-13"
    },
    "B-Air": {
      Startup: "6",
      "Total Frames": "33",
      "Landing Lag": "6",
      "Additional Notes": "Auto cancels on frame 1-5 and frame 19 onward",
      "Base Damage": "10.5 / 7.0",
      Shieldlag: "8/7",
      Shieldstun: "4/3",
      "<-Which hitbox?": "Early/Late",
      Advantage: "-2/-3/-2/-3"
    },
    "U-Air": {
      Startup: "4",
      "Total Frames": "30",
      "Landing Lag": "6",
      "Additional Notes": "Auto cancels on frame 17 onward",
      "Base Damage": "7.0 / 5.9",
      Shieldlag: "7/6",
      Shieldstun: "3/3",
      "<-Which hitbox?": "",
      Advantage: "-3/-3"
    },
    "D-Air": {
      Startup: "5/7/9/11/13/23",
      "Total Frames": "37",
      "Landing Lag": "15",
      "Additional Notes": "Auto cancels on frame 1-4 and frame 33 onward",
      "Base Damage": "1.3 / 5.5",
      Shieldlag: "4/6/4",
      Shieldstun: "2/3/3",
      "<-Which hitbox?": "Multihit/Final/\nLanding",
      Advantage: "-11"
    },
    Fireball: {
      Startup: "17",
      "Total Frames": "49",
      "Landing Lag": "",
      "Additional Notes": "Fireball disappears on frame 88.",
      "Base Damage": "5.0 / 4.0",
      Shieldlag: "6/5",
      Shieldstun: "3/2",
      "<-Which hitbox?": "Early/late",
      Advantage: "-23"
    },
    Cape: {
      Startup: "12",
      "Total Frames": "35",
      "Landing Lag": "",
      "Additional Notes": "Reflects on frame 6-20",
      "Base Damage": "7.0",
      Shieldlag: "7",
      Shieldstun: "7",
      "<-Which hitbox?": "",
      Advantage: "-16"
    },
    "Super Jump Punch": {
      Startup: "3/7/9/11/13/15/17",
      "Total Frames": "",
      "Landing Lag": "30",
      "Additional Notes": "Invulnerable on frame 3-6",
      "Base Damage": "5.0 / 0.6 / 3.0",
      Shieldlag: "6/4/5",
      Shieldstun: "6/2/4",
      "<-Which hitbox?": "First/multihit/\nFinal"
    },
    "F.L.U.D.D. ": {
      Startup: "2 (+19)",
      "Total Frames": "48",
      "Landing Lag": "",
      "Additional Notes":
        "Startup is 2 from a charging state. Entering charge state\ntakes 19 frames and is shield cancellable on 20."
    },
    "F.L.U.D.D. (full charge)": {
      Startup: "21",
      "Total Frames": "67",
      "Landing Lag": "",
      "Additional Notes": "Takes 100 frames to reach full charge."
    },
    Grab: { Startup: "6", "Total Frames": "34" },
    "Dash Grab ": { Startup: "9", "Total Frames": "42" },
    "Pivot Grab": { Startup: "10", "Total Frames": "36" },
    Pummel: {
      Startup: "1",
      "Total Frames": "17",
      "Landing Lag": "",
      "Additional Notes":
        "Total frames includes 13 frames of hitlag (plus one in 1v1)",
      "Base Damage": "1.3"
    },
    "Forward Throw": {
      Startup: "13 ",
      "Total Frames": "27 ",
      "Landing Lag": "",
      "Additional Notes": "",
      "Base Damage": "8.0"
    },
    "Back Throw": {
      Startup: "44",
      "Total Frames": "59",
      "Landing Lag": "",
      "Additional Notes": "",
      "Base Damage": "11.0"
    },
    "Up Throw": {
      Startup: "18",
      "Total Frames": "39",
      "Landing Lag": "",
      "Additional Notes": "",
      "Base Damage": "7.0"
    },
    "Down Throw": {
      Startup: "18",
      "Total Frames": "39",
      "Landing Lag": "",
      "Additional Notes": "",
      "Base Damage": "5.0"
    },
    undefined: {},
    "Spot Dodge": {
      Startup: "",
      "Total Frames": "20/25",
      "Landing Lag": "",
      "Additional Notes": "Invulnerable on frame 3-17"
    },
    "Forward Roll": {
      Startup: "",
      "Total Frames": "29",
      "Landing Lag": "",
      "Additional Notes": "Invulnerable on frame 4-15 "
    },
    "Back Roll": {
      Startup: "",
      "Total Frames": "34",
      "Landing Lag": "",
      "Additional Notes": "Invulnerable on frame 5-16 "
    },
    "Neutral Air Dodge": {
      Startup: "",
      "Total Frames": "52",
      "Landing Lag": "10",
      "Additional Notes": "Invulnerable on frame 3-29"
    },
    "Dir. AD (down)": {
      Startup: "",
      "Total Frames": "71",
      "Landing Lag": "11-19",
      "Additional Notes": "Invulnerable on frame 3-21."
    },
    "Dir. AD (diagonally down)": {
      Startup: "",
      "Total Frames": "77",
      "Landing Lag": "11-19",
      "Additional Notes": "Invulnerable on frame 3-21."
    },
    "Dir. AD (left or right)": {
      Startup: "",
      "Total Frames": "87",
      "Landing Lag": "11-19",
      "Additional Notes": "Invulnerable on frame 3-21."
    },
    "Dir. AD (diagonally up)": {
      Startup: "",
      "Total Frames": "102",
      "Landing Lag": "11-19",
      "Additional Notes": "Invulnerable on frame 3-21."
    },
    "Dir. AD (up)": {
      Startup: "",
      "Total Frames": "116",
      "Landing Lag": "11-19",
      "Additional Notes": "Invulnerable on frame 3-21."
    }
  }
};
