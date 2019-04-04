let { google } = require("googleapis");

const getSheetNames = auth => {
  const sheets = google.sheets({ version: "v4", auth });
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.get(
      {
        spreadsheetId: "1ZF5URHAeAuawxCKhL1QPI_iSrjHHexRIUTvJtQ2c4Rk"
      },
      (err, res) => {
        resolve(res.data.sheets.map(sheet => sheet.properties.title));
      }
    );
  });
};

module.exports = getSheetNames;
