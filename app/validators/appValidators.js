const { body, param, check} = require('express-validator');
const { validadorResultados } = require('../utils/validatorsConfig');


const validator_login_app = [
    body('folio').isString().notEmpty().withMessage('El folio es obligatorio'),
    body('contrasena').isString().notEmpty().withMessage('La contraseña es obligatoria'),
    (req, res, next) => validadorResultados(req, res, next)
];


module.exports = {validator_login_app}