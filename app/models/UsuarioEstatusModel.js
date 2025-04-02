const mongoose = require('mongoose');

const UsuarioEstatusSchema = mongoose.Schema({
    clave_estatus: { type: Number },
    nombre_estatus: { type: String },
    descripcion_estatus: { type: String }
}, { timestamps: true });

module.exports = UsuarioEstatusModel =  mongoose.model('usuario_estatuses', UsuarioEstatusSchema);