const config = require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json('Hello World');
});

app.get('/usuarios', (req, res) => {
    res.json('get Usuario');
});

app.post('/usuarios', (req, res) => {
    let body = req.body; // already parsed by body-parser
    if (!body.nombre) {
        res.status(400).json({
            status:400,
            error: 'cepsa.api.error.Required',
            message:'El nombre es necesario',
            info: ['nombre']
        })
    } else {
        res.json(body);
    }
});

app.put('/usuarios/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuarios/:id', (req, res) => {
    res.json('delete Usuario');
});

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});
