const jwt = require('jsonwebtoken');
const { tokenSecret } = require('../config/config');
const { unauthorized } = require('../routes/common');

const verificarToken = (req, res, next) => {

    let token = req.get('x-usr-jwt');
    console.log("Token:", token);

    jwt.verify(token, tokenSecret, (err, decoded) => {
        if (err) {
            unauthorized(res);
        } else {
            req.id_token = decoded;
            next();
        }
    });

};

const verificarAdminRole = (req, res, next) => {

    if (!req.id_token) {
        unauthorized(res);
        return;
    }

    let usuario = req.id_token.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        unauthorized(res);
    } else {
        next();
    }

};

module.exports = {
    verificarToken,
    verificarAdminRole
}
