let { google } = require("googleapis");

//1k64M9MZ_-s-VDzdK8wrQvzJZJv1HKMusAIZLKhad5cQ is my version 3.0.0 sheet

const getSheetNames = auth => {
  const sheets = google.sheets({ version: "v4", auth });
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.get(
      {
        spreadsheetId: "1k64M9MZ_-s-VDzdK8wrQvzJZJv1HKMusAIZLKhad5cQ"
      },
      (err, res) => {
        resolve(res.data.sheets.map(sheet => sheet.properties.title));
      }
    );
  });
};

module.exports = getSheetNames;
