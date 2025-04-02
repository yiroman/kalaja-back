const mongoose = require('mongoose');

const DependenciasSchema = mongoose.Schema({
    clave_dependencia: { type: Number },
    nombre_dependencia: { type: String },
    tipo_dependencia: { type: String },
    subtipo_dependencia: { type: String },
    correo_titular_cero_papel: { type: String },
    nombre_titular: { type: String },
}, { timestamps: true });

module.exports = DependenciasModel = mongoose.model('dependencias', DependenciasSchema);