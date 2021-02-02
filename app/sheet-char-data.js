let { google } = require("googleapis");

const getCharacterSheetData = (auth, sheetName) => {
  const sheets = google.sheets({ version: "v4", auth });

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: "1U7Zb_CmHmUmjt5PSueMNuBj1bwd9XFRZ8MkNl08M-_I",
        range: `${sheetName}!A:J`,
      },
      (err, res) => {
        console.log(`${sheetName}!A:J`);
        if (err) return console.log("The api returned error: " + err);
        const rawData = res.data.values;
        //rawData is an array of arrays, the inside values are
        // from value 0, 1, 2, 3...
        //[Move Name, startup, total frames, landing lag, additional notes, base damage, shieldlag. shield stun, which hitbox, advantage]

        if (rawData.length) {
          resolve(rawData);
        } else {
          resolve([]);
        }
      }
    );
  });
};

module.exports = getCharacterSheetData;
