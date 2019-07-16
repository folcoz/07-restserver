const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const common = require('./common');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es necesaria'],
        unique: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

categoriaSchema.plugin(uniqueValidator, {message: 'La descripción debe ser única'});

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = {
    Categoria,
    fetchCategorias: common.fetchDocumentsByCondition(Categoria)
};
