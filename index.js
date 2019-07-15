const express = require('express');
const bodyParser = require('body-parser');


const authRouter = require('./routes/auth');
const tripRouter = require('./routes/trips');


const apiVersion = '/api/v1/';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(apiVersion, authRouter);
app.use('/api/v1/trips/', tripRouter);

const port = process.env.PORT || 4000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
