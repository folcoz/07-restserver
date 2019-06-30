const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const R = require('ramda');

const { OAuth2Client } = require('google-auth-library');

const { Usuario, saveGoogleUser } = require('../models/usuario');

const config = require('../config/config');
const { unauthorized } = require('./common');

const oauth2Client = new OAuth2Client(config.googleClientId);

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

async function verify(token) {
    const ticket = await oauth2Client.verifyIdToken({
        idToken: token,
        audience: config.googleClientId,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async (req, res) => {
    
    let idtoken = req.body.idtoken;

    try {
        let googleUser = await verify(idtoken);
        console.log('Google user (verified):', googleUser);

        // Add to DB if not there yet
        let usuarioDB = await saveGoogleUser(googleUser);

        let token = jwt.sign({
            usuario: usuarioDB
        }, config.tokenSecret, {expiresIn: config.tokenExpiresIn});

        res.json({
            status: 200,
            data: usuarioDB,
            token
        });

    } catch (err) {
        console.error(err);
        unauthorized(res);
    }

});

module.exports = app;
