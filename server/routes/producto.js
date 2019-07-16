const express = require('express');
const R = require('ramda');

const { verificarToken, verificarAdminRole } = require('../middleware/authentication');

let { Producto } = require('../models/producto');
let { noProblem } = require('./common');

let app = express();

app.get('/productos', verificarToken, (req, res) => {
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    let activos = {disponible: true};

    Producto.find(activos)
        .skip(desde)
        .limit(limite)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    error: 'cepsa.api.error.InternalError',
                    message: err.toString(),
                    err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    status: 400,
                    error: 'cepsa.api.error.BadRequest'
                });
            }

            res.json({
                status: 200,
                productos
            });
        });
});

app.get('/productos/buscar', verificarToken, (req, res) => {

    let termino = req.query.q || '.';
    let search = new RegExp(termino, 'i');

    Producto.find({nombre: search})
        .populate('categoria', 'descripcion')
        .exec((err, prods) => {
            if (noProblem(res, err, prods)) {
                res.json({
                    status: 200,
                    productos: prods
                });
            }
        });
});

app.get('/productos/:id', verificarToken, (req, res) => {
    
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria')
        .populate('usuario')
        .exec((err, document) => {
            if (err) {
                res.status(400).json({
                    status: 400,
                    error: 'cepsa.api.error.BadRequest',
                    message: err.toString(),
                    err
                });
            } else {
                res.json(document);
            }
    });

});

app.post('/productos', [verificarToken, verificarAdminRole], (req, res) => {
    let usuario = req.id_token.usuario._id;
    let body = req.body; // already parsed by body-parser

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: Number(body.precioUni),
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario
    });

    producto.save((err, productoDB) => {
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
                producto: productoDB
            });    
        }
    });
});

app.put('/productos/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;
    let body = R.omit(['_id','__v','usuario'], req.body);

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, productoDB) => {
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
                producto: productoDB
            });
        }
    });

});

app.delete('/productos/:id', [verificarToken, verificarAdminRole], (req, res) => {
    
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: false}, (err, productoDB) => {
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
                producto: productoDB
            });
        }
    });

});

module.exports = app;
