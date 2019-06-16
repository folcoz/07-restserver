const bcrypt = require('bcrypt');
const R = require('ramda');

const Usuario = require('../models/usuario');

const countDocumentsByCondition = (Model) => (condition = {}) => new Promise((resolve, reject) => {
    Model.countDocuments(condition, (err, count) => {
        if (err) {
            reject(err);
        } else {
            resolve(count);
        }
    });
});

const fetchDocumentsByCondition = (Model) => (condition = {}, offset = 0, max = 5) => new Promise((resolve, reject) => {
    Model.find(condition)
        .skip(offset)
        .limit(max)
        .exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
});

const fetchUsuarios = fetchDocumentsByCondition(Usuario);
const totalUsuarios = countDocumentsByCondition(Usuario);

let routes = (app) => {

    app.get('/', (req, res) => {
        res.json('Hello World');
    });
    
    app.get('/usuarios', (req, res) => {

        let desde = Number(req.query.desde || 0);
        let limite = Number(req.query.limite || 5);
        let activos = {estado: true};

        Promise.all([fetchUsuarios(activos, desde, limite), totalUsuarios(activos)]).then(([usuarios, totalUsuarios]) => {
            res.json({
                status: 200,
                usuarios,
                totalUsuarios
            });
        }).catch(err => {
            res.status(400).json({
                status: 400,
                error: 'cepsa.api.error.BadRequest',
                message: err.toString(),
                err
            });
        });

    });

    app.post('/usuarios', (req, res) => {
        let body = req.body; // already parsed by body-parser

        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });

        usuario.save((err, usuarioDB) => {
            if (err) {
                res.status(400).json({
                    status: 400,
                    error: 'cepsa.api.error.BadRequest',
                    message: err.toString(),
                    err
                });
            } else {
                res.json({
                    status: 200,
                    usuario: usuarioDB
                });    
            }
        });
    });
    
    app.put('/usuarios/:id', (req, res) => {
        let id = req.params.id;
        let body = R.omit(['_id','__v','password','google'], req.body);

        Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
            if (err) {
                res.status(400).json({
                    status: 400,
                    error: 'cepsa.api.error.BadRequest',
                    message: err.toString(),
                    err
                });
            } else {
                res.json({
                    status: 200,
                    usuario: usuarioDB
                });
            }
        });

    });
    
    app.delete('/usuarios/:id', (req, res) => {
        
        let id = req.params.id;

        // Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
        Usuario.findByIdAndUpdate(id, {estado: false}, (err, usuarioDB) => {
            if (err) {
                res.status(400).json({
                    status: 400,
                    error: 'cepsa.api.error.BadRequest',
                    message: err.toString(),
                    err
                });
            } else {
                res.json({
                    status: 200,
                    usuario: usuarioDB
                });
            }
        });


    });
    
};

module.exports = {
    routes
};