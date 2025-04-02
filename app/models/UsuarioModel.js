const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },

    token: { type: String },

    clave_estatus: { type: Number, default: 1 },
    nombre_estatus: { type: String, default: 'Habilitado' },
    justificacion_estatus: { type: String },

    correo: {type: String, required: true },
    contrasena: {type: String, required: true },

    nombre: { type: String, required: true},
    ap_paterno: { type: String, required: true },
    ap_materno: { type: String, required: true },

    curp: { type: String, required: true },

    clave_dependencia: { type: Number, required: true },

    clave_rol: { 
        type: Number, required: true,
        enum: [35, 74, 48]
    },
},{
    timestamps: true
});

module.exports = UsuarioModel = mongoose.model('usuarios', UsuariosSchema)