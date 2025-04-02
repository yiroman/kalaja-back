const { validationResult } = require("express-validator");
const { respuestaHTTP } = require('../utils/errores');

const validadorResultados = (req, res, next) => {
    try {
        validationResult(req).throw();
        return next();
    } catch (e) {
        respuestaHTTP(res, 400, e)
    }
}


module.exports = {validadorResultados}
