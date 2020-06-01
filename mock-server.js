const express = require('express');
var faker = require('faker');
const server = express();
const port = 3000;
var cors = require('cors');
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(cors());
server.use(express.json());

var sqlite3 = require('sqlite3').verbose();


server.get('/users', (req, resp) => {
  const userDetails = [];
  let db = new sqlite3.Database('./UserDatabase', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the UserDatabase database.');
  });

  db.serialize(() => {
    const limitLower = +req.query.skip;
    const limitUpper = +req.query.top - limitLower;
    console.log(`SELECT * FROM UserInformation limit ${limitLower},${limitUpper}`);
    db.each(`SELECT * FROM UserInformation limit ${limitLower},${limitUpper}`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      userDetails.push(row);
    });
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
    resp.send(userDetails);

  });
});

server.listen(port, () => {
  console.log(`Server started on port no ${port}`)
});
