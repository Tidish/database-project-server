const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');

app.use(cors());
app.use(express.json());

//Localhost
// const conn = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'restoranas_v4',
//   dateStrings: 'date'
// });

// my CLEARDB_DATABASE_URL: mysql://b9e4b9609169bd:ef98abad05b8d68@us-cdbr-iron-east-02.cleardb.net/heroku_4a047a9c92e88c3?reconnect=true
//Heroku CLEARDB
// var connectionString = {
//   host     : 'us-cdbr-iron-east-02.cleardb.net',
//   user     : 'b9e4b9609169bd',
//   password : 'ef98abad05b8d68',
//   database : 'heroku_4a047a9c92e88c3',
//   dateStrings: 'date'
// };

//Heroku JawsDB
var connectionString = {
  host     : 'tviw6wn55xwxejwj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : 'bwkchw1gaqs00y4m',
  password : 'zvo4orgamfm0brl3',
  database : 'aomaoxwfsyijiq79',
  dateStrings: 'date'
};

const conn = mysql.createConnection(connectionString);

conn.connect(function(err){
  (err)? console.log(err) : console.log("all good my man with connection");
});

function handleDisconnect() {
  connection = mysql.createConnection(connectionString); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      console.log("Error when trying to re-connect to server", err);                                  // server variable configures this)
    }
  });
}
handleDisconnect();
// Serve any static files built by React
// app.use(express.static(path.join(__dirname, "client/build")));
//
// app.get("/", function(req, res) {
//   res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

require('./routes/CompaniesRoute')(app, conn);
require('./routes/RestaurantsRoute')(app, conn);
require('./routes/SuppliersRoute')(app, conn);
require('./routes/ClientsRoute')(app, conn);
require('./routes/CommentsRoute')(app, conn);
require('./routes/OrdersRoute')(app, conn);

// Handles any requests that don't match the ones above
app.get('/database-project/*', (req,res) =>{
    // res.sendFile(path.join(__dirname+'/client/build/index.html'));
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
