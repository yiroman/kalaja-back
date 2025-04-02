const mongoose = require('mongoose');

const BitacoraOperadoresSchema = mongoose.Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    estatus: { type: String },
    cliente: { type: String },
    id_usuario: {type: mongoose.ObjectId },
    nombre:  { type: String },
    accion: { type: String },
    tipo: { type: String },
    nombre_rol: { type: String },
    clave_rol: { type: String }
},{
    timestamps: true
});

module.exports = BitacoraOperadoresModel = mongoose.model('bitacoras_operadores', BitacoraOperadoresSchema);