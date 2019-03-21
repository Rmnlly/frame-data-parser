let { google } = require("googleapis");
const fs = require("fs");
let authentication = require("./google-authentication");

const getSheetNames = async (auth, cb) => {
  const sheets = google.sheets({ version: "v4", auth });
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.get(
      {
        spreadsheetId: "1ZF5URHAeAuawxCKhL1QPI_iSrjHHexRIUTvJtQ2c4Rk"
      },
      (err, res) => {
        // cb(res.data.sheets.map(sheet => sheet.properties.title));
        // console.log(res.data.sheets.map(sheet => sheet.properties.title));
        resolve(res.data.sheets.map(sheet => sheet.properties.title));
      }
    );
  });
};

const getCharacterSheetData = (auth, characterSheet) => {
  const sheets = google.sheets({ version: "v4", auth });

  getSheetNames(auth).then(data => console.log(data));

  sheets.spreadsheets.values.get(
    {
      spreadsheetId: "1ZF5URHAeAuawxCKhL1QPI_iSrjHHexRIUTvJtQ2c4Rk",
      range: `${characterSheet}!A:J`
    },
    (err, res) => {
      if (err) return console.log("The api returned error: " + err);
      const rawData = res.data.values;
      if (rawData.length) {
        console.log(`Data for ${characterSheet}`);
        rawData.map(move => {
          console.log(`Move name: ${move[0]}`);
        });
      } else {
        console.log("Nah no data");
      }
    }
  );
};

module.exports = authentication.then(auth => {
  getCharacterSheetData(auth, "01 - Mario");
});
