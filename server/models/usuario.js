const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const common = require('./common');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required : [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: {
            values: ['ADMIN_ROLE', 'USER_ROLE'],
            message: '{VALUE} no es un rol válido'
        }
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

const Usuario = mongoose.model('Usuario', usuarioSchema);

const handleWith = (resolve, reject) => (err, document) => {
    if (err) {
        reject(err);
    } else {
        resolve(document);
    }
};

const fetchUsuarioByEmail = (email) => new Promise((resolve, reject) => {
    Usuario.findOne({email}, handleWith(resolve, reject));
});

const saveGoogleUser = (googleUser) => new Promise((resolve, reject) => {
    fetchUsuarioByEmail(googleUser.email)
        .then(usuarioDB => {
            let callback = handleWith(resolve, reject);
            // ignore: user already exists
            if (usuarioDB) {
                console.log('Fetched user:', usuarioDB);
                // Si no es usuario autenticado mediante Google Sign-In, actualizar
                if (usuarioDB.google !== true) {
                    // Actualizar usuarioDB para que sea de Google
                    usuarioDB.google = true;
                    usuarioDB.save(callback);
                } else {
                    resolve(usuarioDB);
                }
            } else {
                // user does not exist, create new user
                let user = new Usuario({
                    nombre: googleUser.nombre,
                    email: googleUser.email,
                    password: '********',
                    role: 'USER_ROLE',
                    google: true
                });
                user.save(callback);
            }
        })
        .catch(err => {
            console.error(err);
            resolve(err);
        });
});

module.exports = {
    Usuario,
    fetchUsuarios: common.fetchDocumentsByCondition(Usuario),
    totalUsuarios: common.countDocumentsByCondition(Usuario),
    fetchUsuarioByEmail,
    saveGoogleUser
};
