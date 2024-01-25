
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const { google } = require("googleapis");
require('dotenv').config();
app.set('view engine', 'ejs');





app.get("/", (req, res) => {
    res.render("index.ejs");
  });

app.get("/data", async (req, res) => {

    const auth = new google.auth.GoogleAuth({
        keyFile: "./secret-key.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });

      // Create client instance for auth
     const client = await auth.getClient();
     // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1",
      });
      const data=getRows.data.values;
      console.log(data);
    res.render("data.ejs" ,{data});
})

app.post('/test', async (req, res) => {

    const { request, name } = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "./secret-key.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });

      // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });


  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1",
  });


  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[request, name]],
    },
  });


  res.send(res.body);
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

});
