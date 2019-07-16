
const express = require('express');
const R = require('ramda');

let { verificarToken, verificarAdminRole } = require('../middleware/authentication');

let app = express();

let { Categoria, fetchCategorias } = require('../models/categoria');

app.get('/categorias', verificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
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
                    categorias
                });
            }
        });
});

app.get('/categorias/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            res.status(400).json({
                status: 400,
                error: 'cepsa.api.error.BadRequest',
                message: err.toString(),
                err
            });
        } else {
            res.json(categoriaDB);
        }
    });
    
});

app.post('/categorias', verificarToken, (req, res) => {
    
    let body = req.body;
    let usuario = req.id_token.usuario;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario
    });

    categoria.save((err, categoriaDB) => {
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
                categoria: categoriaDB
            });
        }
    });
});

app.put('/categorias/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = R.omit(['_id','__v'], req.body);

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                error: 'cepsa.api.error.InternalError',
                message: err.toString(),
                err
            });
        }
        
        if (!categoriaDB) {
            return res.status(404).json({
                status: 404,
                error: 'cepsa.api.error.NotFound',
                message: `Categoria ${id} not found`
            });
        }
        
        return res.json({
            status: 200,
            categoria: categoriaDB
        });
        
    });

});

app.delete('/categorias/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;
    // eliminar físicamente Categoria.findByIdAndRemove()
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
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
                categoria: categoriaDB
            });
        }
    });
});

module.exports = app;
