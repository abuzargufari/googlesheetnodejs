
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const { google } = require("googleapis");
require('dotenv').config();
app.set('view engine', 'ejs');
const path = require('path');
app.use(express.static(path.join(__dirname, 'src', 'controller', 'views', 'public')));

// sheet authorization
const auth = new google.auth.GoogleAuth({
  keyFile: "./secret-key.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});




app.get("/", (req, res) => {
    res.render("index.ejs");
  });


  // to fetch data
app.get("/data", async (req, res) => {



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

//fetch sum of record of each person
app.get("/sum-of-record", async (req, res) => {

	// Create client instance for auth
   const client = await auth.getClient();
   // Instance of Google Sheets API
const googleSheets = google.sheets({ version: "v4", auth: client });
const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const getRows = await googleSheets.spreadsheets.values.get({
	  auth,
	  spreadsheetId,
	  range: "Sheet2",
	});
	const data=getRows.data.values;
	console.log(data);
  res.render("data.ejs" ,{data});
})

app.post('/test', async (req, res) => {

    const { request, name } = req.body;

      // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;


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

  res.send("OK");
});

app.get("/upload", (req, res) => {

	res.render("upload.ejs");
})

app.post('/submit-form', async (req, res) => {
	const name = req.body.Name;
	const email = req.body.price;
	const bodyValue=req.body
	const myArray = Object.keys(bodyValue).map(key => bodyValue[key]);
	let arrayValue=['=row()', ...myArray];
	console.log(arrayValue);

	   // Create client instance for auth
	   const client = await auth.getClient();

	   // Instance of Google Sheets API
	   const googleSheets = google.sheets({ version: "v4", auth: client });
	   const spreadsheetId = process.env.GOOGLE_SHEET_ID;


	   // Write row(s) to spreadsheet
	   await googleSheets.spreadsheets.values.append({
		 auth,
		 spreadsheetId,
		 range: "Sheet1!B:E",
		 valueInputOption: "USER_ENTERED",
		 resource: {
		   values: [ arrayValue],
		 },
	   });

	const data = {
		message: 'Hello, this is a dynamic message!'
	  };
	  res.render('upload.ejs', data);
  });

app.get("/add", async (req, res) => {

	   // Create client instance for auth
	   const client = await auth.getClient();

	   // Instance of Google Sheets API
	   const googleSheets = google.sheets({ version: "v4", auth: client });
	   const spreadsheetId = process.env.GOOGLE_SHEET_ID;


	   // Write row(s) to spreadsheet
	   await googleSheets.spreadsheets.values.append({
		 auth,
		 spreadsheetId,
		 range: "Sheet1!B:E",
		 valueInputOption: "USER_ENTERED",
		 resource: {
		   values: [ [ '=row()' , 'abuzar', 'egg,milk', '56', '1/26/2024' ]],
		 },
	   });

	res.send("successfull");
  });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
