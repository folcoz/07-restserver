const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const R = require('ramda');

const { Usuario } = require('../models/usuario');

const config = require('../config/config');
const { unauthorized } = require('./common');

const app = express();

app.post('/login', (req, res) => {

    let p = req.params.p || '123456'

    let body = req.body;
    let email = body.email || '';
    let password = body.password || '';

    Usuario.findOne({email}, (err, usuarioDB) => {
        if (err) {
            res.status(500).json({
                status: 500,
                error: 'cepsa.api.error.ServerError',
                message: err.toString(),
                err
            });
        } else {
            if (!usuarioDB) {
                unauthorized(res);
            } else {
                let pwdmatch = bcrypt.compareSync(password, usuarioDB.password);
                if (!pwdmatch) {
                    unauthorized(res);
                } else {
                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, config.tokenSecret, {expiresIn: config.tokenExpiresIn});
                    res.json({
                        status: 200,
                        data: usuarioDB,
                        token
                    });
                }
            }
        }
    });

});

module.exports = app;
