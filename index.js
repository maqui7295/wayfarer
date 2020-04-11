const express = require('express');
const bodyParser = require('body-parser');

const {
  API_VERSION_1
} = require('./config/environment');

const authRouter = require('./routes/auth');
const tripRouter = require('./routes/trips');

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(API_VERSION_1, authRouter);
app.use(API_VERSION_1, tripRouter);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
