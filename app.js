require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const app = express();
const users = require('./routes/users');

const port = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require('./passport')(passport);

// Put which routes you want to use here.
app.use('/users', users);

app.listen(port, () => {
  console.log('Server started at port ' + port);
});