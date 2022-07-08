const dotenv = require('dotenv');
dotenv.config();

const { google } = require('googleapis');

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = process.env;

// Login google account
const oauth2Client = new google.auth.OAuth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Login spreadsheets
const googleSheets = google.sheets({
  version: 'v4',
  auth: oauth2Client,
});

const spreadsheetId = '1YfXCLR-A-hYB7TKrqNSt7zTDv6YYYB9BeWY-jmrepZc';

async function getLastNo(range) {
  try {
    const result = await googleSheets.spreadsheets.values.get({
      range,
      spreadsheetId,
    });
  
    return result.data.values
    ? result.data.values.at(-1)[0]
    : 0;
  } catch (error) {
    console.log(error.message);
  }
}

async function inserToSheet(values, range) {
  try {
    const result = await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values,
      }
    });
    
    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getLastNo, inserToSheet };