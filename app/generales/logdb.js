const winston = require("../config/winston"),
    jwt = require("jsonwebtoken"),
    mongoose = require('mongoose');
    BitacoraOperadoresModel = require('../models/BitacoraOperadoresModel');

const logdb = (req, accion, tipo) => {
    const token = req.get('Authorization')?.replace(/^Bearer\s+/, "");
    if(token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        let data = {
            estatus: "",
            cliente: req.headers['user-agent'],
            id_usuario: mongoose.Types.ObjectId(decoded.id),
            nombre: decoded.nombre_completo,
            accion: accion,
            tipo: tipo,
            nombre_rol: decoded.rol.nombre,
            clave_rol: decoded.rol.clave,
            correo: decoded.correo,
        };
        console.log(data);
        const bitacora = new BitacoraOperadoresModel(data);
        bitacora.save();
    }
}

module.exports = logdb;