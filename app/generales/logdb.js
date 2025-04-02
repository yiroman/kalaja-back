const winston = require("../config/winston"),
    jwt = require("jsonwebtoken"),
    mongoose = require('mongoose');
    BitacoraOperadoresModel = require('../models/BitacoraOperadoresModel');

const logdb = (req, accion, tipo) => {
    const { token } = req.session.eventos;
    if(token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        let data = {
            estatus: "",
            cliente: req.headers['user-agent'],
            id_usuario: mongoose.Types.ObjectId(decoded.id),
            nombre: decoded.nombre_completo,
            accion: accion,
            tipo: tipo,
            nombre_rol: decoded.nombre_rol,
            clave_rol: decoded.clave_rol,
            correo: decoded.correo,
        };
        const bitacora = new BitacoraOperadoresModel(data);
        bitacora.save();
    }
}

module.exports = logdb;