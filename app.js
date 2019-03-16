require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const utils = require('./database/utils');

const app = express();
const users = require('./routes/users');

const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use('/users', users);

app.use(passport.initialize());
app.use(passport.session());
require('./passport')(passport);

app.get('/', (req,res) => {
  res.send('Invalid endpoint');
});

app.listen(port, () => {
  console.log('Server started at port ' + port);
});

if (process.env.REBUILD_DATA && process.env.REBUILD_DATA === 'TRUE') {
  utils.rebuildData()
      .then(() => {
        console.log('done setting up');
      });
}

module.exports = app;