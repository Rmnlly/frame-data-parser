const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = `${__dirname}/../credentials/token.json`;

const authenticate = async () => {
  return new Promise((resolve, reject) => {
    const credentials = getClientSecret();
    const authorizePromise = authorize(credentials);
    authorizePromise.then(resolve, reject);
  });
};

// Get and return client secrets from a local file.
const getClientSecret = () => {
  return require("../credentials/credentials.json");
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
const authorize = credentials => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  return new Promise((resolve, reject) => {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err)
        return getNewToken(oAuth2Client).then(
          oAuthC2ClientNew => {
            resolve(oAuthC2ClientNew);
          },
          err => {
            reject(err);
          }
        );
      //If the token already exists we just set the credentials
      oAuth2Client.setCredentials(JSON.parse(token));
      resolve(oAuth2Client);
    });
  });
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 */
const getNewToken = oAuth2Client => {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err)
          return console.error(
            "Error while trying to retrieve access token",
            err
          );
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        resolve(oAuth2Client);
      });
    });
  });
};

module.exports = authenticate();
