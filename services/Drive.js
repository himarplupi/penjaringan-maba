const dotenv = require('dotenv');
dotenv.config();

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = process.env;

module.exports = async (name, mimeType, filePath) => {
  // Login google account
  const oauth2Client = new google.auth.OAuth2({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  });
  
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  // Login drive
  const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  });

  try {
    const filename = name + path.extname(filePath);
    const response = await drive.files.create({
      requestBody: {
        name: filename,
        mimeType,
        parents: ['1AFgjdUDB3P6jcL_aV3EtqucqbrtGCL64'],
      },
      media: {
        mimeType,
        body: fs.createReadStream(filePath),
      }
    });

    return response;
  } catch (error) {
    return error.message;
  }
}