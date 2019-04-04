let { google } = require("googleapis");

const getCharacterSheetData = (auth, sheetName) => {
  const sheets = google.sheets({ version: "v4", auth });

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: "1ZF5URHAeAuawxCKhL1QPI_iSrjHHexRIUTvJtQ2c4Rk",
        range: `${sheetName}!A:J`
      },
      (err, res) => {
        if (err) return console.log("The api returned error: " + err);
        const rawData = res.data.values;
        if (rawData.length) {
          resolve(rawData.map(move => move[0]));
        } else {
          resolve([]);
        }
      }
    );
  });
};

module.exports = getCharacterSheetData;
