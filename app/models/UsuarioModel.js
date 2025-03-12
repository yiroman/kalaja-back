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



    telefono: { type: String, required: true },
   
    clave_rol: { 
        type: Number, required: true,
        enum: [27, 35, 53, 48]},
        
    nombre_rol: { 
        type: String,
        enum: ["Superadministrador", "Administrador", "ROM", "Operador"],
        required: true} 
},{
    timestamps: true
});

module.exports = UsuarioModel = mongoose.model('usuarios', UsuariosSchema)