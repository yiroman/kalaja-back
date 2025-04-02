const { respuestaHTTP } = require("../utils/errores");
const { param, validationResult, check } = require("express-validator");
const {validadorResultados} = require("../config/validators")



const inicio_sesion_validator = [
    check("correo")
        .exists()
        .notEmpty()
        .isEmail(),
    check("contrasena")
        .exists()
        .notEmpty(),
    (req, res, next) => validadorResultados(req, res, next)
]

const correo_validator = [
    param("email")
      .isEmail()
      .withMessage("El correo electrónico no tiene un formato válido")
      .normalizeEmail(), // Normaliza el correo (elimina espacios y caracteres inválidos)
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        respuestaHTTP(res, 400, `Error en la validación del correo: ${errors.array()}`,);
      }
      next();
    },
  ];

const curp_validator = [
    param("curp")
      .matches(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/i)
      .withMessage("La CURP no tiene un formato válido"),
    (req, res, next) => {
      const errors = validadorResultados(req);
      if (!errors.isEmpty()) {
        respuestaHTTP(res, 400, `Error en la validacion de la curp${errors.array()}`)
      }
      next();
    },
  ];

module.exports = {inicio_sesion_validator, correo_validator, curp_validator}