const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const {
  API_VERSION_1
} = require('./config/environment');

const authRouter = require('./routes/auth');
const tripRouter = require('./routes/trips');
const bookingRouter = require('./routes/bookings');

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(API_VERSION_1, authRouter);
app.use(API_VERSION_1, tripRouter);
app.use(API_VERSION_1, bookingRouter);

const port = process.env.PORT || 3000;


// app.get(API_VERSION_1, (req, res) => res.send('Hello World!'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(API_VERSION_1, (req, res) => {
  res.sendFile(path.join(__dirname, 'v1.html'));
});

app.use((req, res, next) => {
  res.status(404);
  res.sendFile(path.join(__dirname, 'app404.html'));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;