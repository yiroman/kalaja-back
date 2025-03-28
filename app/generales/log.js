const winston = require("../config/winston"),
    logdb = require('../generales/logdb')
    jwt = require("jsonwebtoken");
const log = (req, level, accion, tipo = "") => {
    const token = req.get('Authorization')?.replace(/^Bearer\s+/, "");
    if(token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        winston.log({
            level: level,
            message: `${req.ip} - [${new Date().toString()}] - ${req.headers['user-agent']} - ${decoded.nombre_completo} - ${decoded.correo} - ${accion}`
        });
        logdb(req, accion, tipo);
    }
}

module.exports = log;