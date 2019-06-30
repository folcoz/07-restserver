const config = require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index'));

const listen = (mngoose) => {
    console.log('Mongoose is ready');

    app.listen(config.port, () => {
        console.log(`Listening on port ${config.port}`);
    });    
};

mongoose.connect(config.dbURL, {useNewUrlParser: true, useCreateIndex: true})
    .then(listen)
    .catch(console.error);