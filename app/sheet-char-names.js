let { google } = require("googleapis");

//1k64M9MZ_-s-VDzdK8wrQvzJZJv1HKMusAIZLKhad5cQ is my version 3.0.0 sheet
//1wI3pjw-q6pRZZbvwx0neJMDNoFJDobOcaUyvaD33qXE is the version 7.0.0 sheet
//1U7Zb_CmHmUmjt5PSueMNuBj1bwd9XFRZ8MkNl08M-_I is the version 10.1 sheet

const getSheetNames = (auth) => {
  const sheets = google.sheets({ version: "v4", auth });
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.get(
      {
        spreadsheetId: "1U7Zb_CmHmUmjt5PSueMNuBj1bwd9XFRZ8MkNl08M-_I",
      },
      (err, res) => {
        resolve(res.data.sheets.map((sheet) => sheet.properties.title));
      }
    );
  });
};

module.exports = getSheetNames;
