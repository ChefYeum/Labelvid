import express from "express";

const app = express();
const path = require('path');
const port = 8090;

app.use(express.static('client'));

// viewed at http://localhost:8080
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname + '/client/index.html'));
// });

app.listen(port, () => {
  console.log( `Server started at http://localhost:${port}`);
});