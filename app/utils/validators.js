const { check } = require('express-validator'),
    { errorAd } = require('../utils/errores'),
    { validationResult } = require("express-validator")

const validadorResultados = (req, res, next) => {
    try {
        validationResult(req).throw();
        return next();
    } catch (e) {
        res.status(400);
        res.send({ error: e.mapped() });
    }
}

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
const tramites_dependencia_validator = [
    check("id_dependencia")
        .exists()
        .notEmpty()
        .isInt(),
    (req, res, next) => validadorResultados(req, res, next)
]
const tramite_validator = [
    check("id_tramite")
        .exists()
        .notEmpty()
        .isMongoId(),
    (req, res, next) => validadorResultados(req, res, next)
]
const dependencia_validator = [
    check("id_dependencia")
        .exists()
        .notEmpty()
        .isInt(),
    (req, res, next) => validadorResultados(req, res, next)
]
const comentario_validator = [
    check("id_comentario")
        .exists()
        .notEmpty()
        .isMongoId(),
    (req, res, next) => validadorResultados(req, res, next)
]
const observacion_validator = [
    check("id_observacion")
        .exists()
        .notEmpty()
        .isMongoId(),
    (req, res, next) => validadorResultados(req, res, next)
]
const correo_validator = [
    check("correo")
        .exists()
        .notEmpty()
        .isEmail(),
    (req, res, next) => validadorResultados(req, res, next)
]

/*************************
 * Validaciones para nuevo trámite
 *************************/
const nuevo_tramite_validator = [
    check("clave_dependencia")
        .exists()
        .notEmpty()
        .isInt(),
    check("dependencia")
        .exists()
        .notEmpty()
        .isString(),
    check("correo_titular_cero_papel")
        .exists()
        .notEmpty()
        .isString(),
    check("nombre_titular")
        .exists()
        .notEmpty()
        .isString(),
    check("regulacion_nombre")
        .exists()
        .notEmpty()
        .isString(),
    check("regulacion_apellido_paterno")
        .exists()
        .notEmpty()
        .isString(),
    check("regulacion_apellido_materno")
        .exists()
        .notEmpty()
        .isString(),
    check("regulacion_cargo")
        .exists()
        .notEmpty()
        .isString(),
    check("regulacion_correo")
        .exists()
        .notEmpty()
        .isString(),
    check("regulacion_telefono")
        .exists()
        .notEmpty()
        .isString(),
    check("tramite_nombre")
        .exists()
        .notEmpty()
        .isString(),
    check("tramite_apellido_paterno")
        .exists()
        .notEmpty()
        .isString(),
    check("tramite_apellido_materno")
        .exists()
        .notEmpty()
        .isString(),
    check("tramite_cargo")
        .exists()
        .notEmpty()
        .isString(),
    check("tramite_correo")
        .exists()
        .notEmpty()
        .isString(),
    check("tramite_telefono")
        .exists()
        .notEmpty()
        .isString(),
    check("nombre_tramite")
        .exists()
        .notEmpty()
        .isString(),
    check("homoclave")
        .exists()
        .notEmpty()
        .isString(),
    check("unidad_administrativa")
        .exists()
        .notEmpty()
        .isString(),
    check("sujeto_obligado")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const tramite_datos_generales = [
    check("nombre_regulaciones")
        .exists()
        .notEmpty()
        .isString(),
    check("apellido_paterno_regulaciones")
        .exists()
        .notEmpty()
        .isString(),
    check("apellido_materno_regulaciones")
        .exists()
        .notEmpty()
        .isString(),
    check("cargo_regulaciones")
        .exists()
        .notEmpty()
        .isString(),
    check("correo_regulaciones")
        .exists()
        .notEmpty()
        .isString(),
    check("telefono_regulaciones")
        .exists()
        .notEmpty()
        .isString(),
    check("nombre_tramites")
        .exists()
        .notEmpty()
        .isString(),
    check("apellido_paterno_tramites")
        .exists()
        .notEmpty()
        .isString(),
    check("apellido_materno_tramites")
        .exists()
        .notEmpty()
        .isString(),
    check("cargo_tramites")
        .exists()
        .notEmpty()
        .isString(),
    check("correo_tramites")
        .exists()
        .notEmpty()
        .isString(),
    check("telefono_tramites")
        .exists()
        .notEmpty()
        .isString(),
    check("nombre_tramite")
        .exists()
        .notEmpty()
        .isString(),
    check("homoclave")
        .exists()
        .notEmpty()
        .isString(),
    check("unidad_administrativa")
        .exists()
        .notEmpty()
        .isString(),
    check("sujeto_obligado")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]

/*************************
 * Validaciones para seccion 2
 *************************/
const tramite_seccion_dos_validator = [
    //Seccion dos
    check("seccion_dos")
        .optional()
        .isObject(),
    check("seccion_dos.pregunta")
        .optional({ nullable: true })
        .isString(),
    //Seccion dos a
    check("seccion_dos_a")
        .optional()
        .isObject(),
    check("seccion_dos_a.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_a.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_a.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_a.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_a.pregunta_cinco")
        .optional({ nullable: true })
        .isString(),
    //Seccion dos b
    check("seccion_dos_b")
        .optional()
        .isObject(),
    check("seccion_dos_b.pregunta_uno")
        .optional({ nullable: true })
        .isBoolean(),
    check("seccion_dos_b.pregunta_dos")
        .optional({ nullable: true })
        .isBoolean(),
    check("seccion_dos_b.pregunta_tres")
        .optional({ nullable: true })
        .isBoolean(),
    check("seccion_dos_b.pregunta_cuatro")
        .optional({ nullable: true })
        .isBoolean(),
    check("seccion_dos_b.pregunta_cinco")
        .optional({ nullable: true })
        .isBoolean(),
    check("seccion_dos_b.pregunta_seis")
        .optional({ nullable: true })
        .isBoolean(),
    check("seccion_dos_b.pregunta_siete")
        .optional({ nullable: true })
        .isBoolean(),
    check("seccion_dos_b.pregunta_ocho")
        .optional({ nullable: true })
        .isBoolean(),
    check("seccion_dos_b.pregunta_nueve")
        .optional({ nullable: true })
        .isBoolean(),
    check("seccion_dos_b.pregunta_diez")
        .optional({ nullable: true })
        .isBoolean(),
    check("seccion_dos_b.pregunta_once")
        .optional({ nullable: true })
        .isBoolean(),
    check("seccion_dos_b.pregunta_doce")
        .optional({ nullable: true })
        .isBoolean(),
    //Seccion dos b - uno
    check("seccion_dos_b_uno.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_uno.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_uno.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_uno.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_uno.pregunta_cinco")
        .optional({ nullable: true })
        .isString(),
    //Seccion dos b - dos
    check("seccion_dos_b_dos")
        .optional()
        .isObject(),
    check("seccion_dos_b_dos.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_dos.requisitos")
        .optional({ nullable: true })
        .isArray(),
    //Seccion dos b - tres
    check("seccion_dos_b_tres")
        .optional()
        .isObject(),
    check("seccion_dos_b_tres.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_tres.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_tres.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_tres.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_tres.pregunta_cinco")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_tres.pregunta_seis")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_tres.pregunta_siete")
        .optional({ nullable: true })
        .isString(),
    //Seccion dos b - cuatro
    check("seccion_dos_b_cuatro")
        .optional()
        .isObject(),
    check("seccion_dos_b_cuatro.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_cuatro.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_cuatro.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_cuatro.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_cuatro.pregunta_cinco")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_cuatro.pregunta_seis")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_cuatro.pregunta_siete")
        .optional({ nullable: true })
        .isString(),
    //Seccion dos b - cinco
    check("seccion_dos_b_cinco")
        .optional()
        .isObject(),
    check("seccion_dos_b_cinco.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_cinco.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_cinco.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_cinco.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_cinco.pregunta_cinco")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_cinco.pregunta_seis")
        .optional({ nullable: true })
        .isString(),
    //Seccion dos b - seis
    check("seccion_dos_b_seis")
        .optional()
        .isObject(),
    check("seccion_dos_b_seis.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_seis.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_seis.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_seis.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_seis.niveles_digitalizacion")
        .optional({ nullable: true })
        .isArray(),
    //Seccion dos b - siete
    check("seccion_dos_b_siete")
        .optional()
        .isObject(),
    check("seccion_dos_b_siete.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_siete.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_siete.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_siete.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_siete.pregunta_cinco")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_siete.pregunta_seis")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_siete.pregunta_siete")
        .optional({ nullable: true })
        .isString(),
    //Seccion dos b - ocho
    check("seccion_dos_b_ocho")
        .optional()
        .isObject(),
    check("seccion_dos_b_ocho.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_ocho.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_ocho.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_ocho.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_ocho.pregunta_cinco")
        .optional({ nullable: true })
        .isString(),
    //Seccion dos b - nueve
    check("seccion_dos_b_nueve")
        .optional()
        .isObject(),
    check("seccion_dos_b_nueve.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_nueve.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_nueve.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_nueve.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_nueve.pregunta_cinco")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_nueve.pregunta_seis")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_nueve.pregunta_siete")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_nueve.pregunta_ocho")
        .optional({ nullable: true })
        .isString(),
    //Seccion dos b - diez
    check("seccion_dos_b_diez")
        .optional()
        .isObject(),
    check("seccion_dos_b_diez.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_diez.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_diez.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_diez.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_diez.pregunta_cinco")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_diez.pregunta_seis")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_diez.pregunta_siete")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_diez.pregunta_ocho")
        .optional({ nullable: true })
        .isString(),
    //Seccion dos b - once
    check("seccion_dos_b_once")
        .optional()
        .isObject(),
    check("seccion_dos_b_once.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_once.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_once.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_once.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_once.pregunta_cinco")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_once.pregunta_seis")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_once.pregunta_siete")
        .optional({ nullable: true })
        .isString(),
    check("seccion_dos_b_once.pregunta_ocho")
        .optional({ nullable: true })
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_validator = [
    check("pregunta")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_a_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_tres")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cuatro")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cinco")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_b_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_tres")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_cuatro")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_cinco")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_seis")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_siete")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_ocho")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_nueve")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_diez")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_once")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_doce")
        .exists()
        .notEmpty()
        .isBoolean(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_b_uno_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_tres")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cuatro")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cinco")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_b_dos_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("requisitos")
        .exists()
        .notEmpty()
        .isArray(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_b_tres_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_tres")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cuatro")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cinco")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_seis")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_siete")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_ocho")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_b_cuatro_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_tres")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cuatro")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cinco")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_seis")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_siete")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_b_cinco_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_tres")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cuatro")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cinco")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_seis")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_b_seis_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_tres")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cuatro")
        .exists()
        .notEmpty()
        .isString(),
    check("niveles_digitalizacion")
        .exists()
        .notEmpty()
        .isArray(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_b_siete_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_tres")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cuatro")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cinco")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_b_ocho_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_tres")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cuatro")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cinco")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_b_nueve_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_tres")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cuatro")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cinco")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_b_diez_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_tres")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cuatro")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cinco")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_seis")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_siete")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_ocho")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_dos_b_once_validator = [
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_tres")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cuatro")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_cinco")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_seis")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_siete")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_ocho")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
/*************************
 * Validaciones para seccion 3
 *************************/
const seccion_tres_validador = [
    check("acciones_a_realizar")
        .exists()
        .notEmpty()
        .isObject(),
    check("acciones_a_realizar.pregunta_uno")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("acciones_a_realizar.pregunta_dos")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("acciones_a_realizar.pregunta_tres")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("acciones_a_realizar.pregunta_cuatro")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("acciones_a_realizar.pregunta_cinco")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("seccion_uno_a")
        .optional()
        .isObject(),
    check("seccion_uno_a.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_uno_a.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_uno_a.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_uno_a.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_uno_b")
        .optional()
        .isObject(),
    check("seccion_uno_b.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_uno_b.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_uno_b.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    check("seccion_uno_b.pregunta_cuatro")
        .optional({ nullable: true })
        .isString(),
    check("seccion_uno_d")
        .optional()
        .isObject(),
    check("seccion_uno_d.pregunta_uno")
        .optional({ nullable: true })
        .isString(),
    check("seccion_uno_d.pregunta_dos")
        .optional({ nullable: true })
        .isString(),
    check("seccion_uno_d.pregunta_tres")
        .optional({ nullable: true })
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]

/*************************
* Validaciones para sección 4
* ************************/
const seccion_cuatro_pregunta_2_validator = [
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_cuatro_pregunta_3_validator = [
    check("opcion_1")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_2")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_3")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_4")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_5")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_6")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_7")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_8")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_9")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_10")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_11")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_12")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_13")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_14")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_15")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_16")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_17")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_18")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_19")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_20")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_21")
        .exists()
        .notEmpty()
        .isBoolean(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_cuatro_pregunta_41_validator = [
    check("opcion_1")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_2")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_3")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_4")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_5")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_6")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_7")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_8")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_9")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_10")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_11")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_12")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_13")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_14")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_15")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_16")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_17")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_18")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_19")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_20")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_21")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_22")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_23")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_cuatro_respuesta_validator = [
    check("respuesta")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_cuatro_pregunta_7_validator = [
    check("opcion_1")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_2")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_3")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_4")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_5")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_6")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_7")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_8")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_9")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_10")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_11")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_12")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_13")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_14")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_15")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_16")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_17")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_18")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_19")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_20")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_21")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_22")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_23")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_24")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_25")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_26")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_27")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_28")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_29")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_30")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_31")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_32")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_33")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_34")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("pregunta_uno")
        .exists()
        .notEmpty()
        .isString(),
    check("pregunta_dos")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_cuatro_pregunta_8_validator = [
    check("opcion_1")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_2")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_3")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_4")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_5")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_6")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_7")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_8")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_9")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_10")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_11")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_12")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_13")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_14")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_15")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_16")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_17")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_18")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_19")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_20")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_21")
        .exists()
        .notEmpty()
        .isBoolean(),
    check("opcion_22")
        .exists()
        .notEmpty()
        .isBoolean(),
    (req, res, next) => validadorResultados(req, res, next)
]
const seccion_cuatro_pregunta_13_validator = [
    check("opcion_1")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_2")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_3")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_4")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_5")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_6")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_7")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_8")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_9")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_10")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_11")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_12")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_13")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_14")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_15")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_16")
        .exists()
        .notEmpty()
        .isString(),
    check("opcion_17")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]

/*************************
 * Validaciones para observaciones de trámites
 *************************/
const observaciones_validator = [
    check("contenido")
        .exists()
        .notEmpty()
        .isString(),
    (req, res, next) => validadorResultados(req, res, next)
]

/*************************
 * Validaciones para periodos
 *************************/
//Validacion para nuevo periodo
const nuevo_periodo_validator = [
    check("nombre_periodo")
        .exists()
        .notEmpty()
        .isString(),
    check("fecha_inicio_periodo")
        .exists()
        .notEmpty()
        .isDate({ format: 'DD-MM-YYYY' }),
    check("fecha_fin_periodo")
        .exists()
        .notEmpty()
        .isDate({ format: 'DD-MM-YYYY' }),
    (req, res, next) => validadorResultados(req, res, next)
]
const actualizar_periodo_validator = [
    check('id_periodo')
        .exists()
        .notEmpty()
        .isMongoId(),
    (req, res, next) => validadorResultados(req, res, next)
]


const omision_validator = [
    check("clave_dependencia")
        .exists().withMessage("El campo clave_dependencia es obligatorio")
        .isInt().withMessage("El campo clave_dependencia debe ser un número entero"),
    check("estatus")
        .exists().withMessage("El campo estatus es obligatorio")
        .isIn([1, 2]).withMessage("El campo estatus debe ser 1 o 2"), // Ejemplo: valores permitidos
    check("nombre_dependencia")
        .exists().withMessage("El campo nombre_dependencia es obligatorio")
        .notEmpty().withMessage("El campo nombre_dependencia no puede estar vacío"),
    check("nombre_rom")
        .exists().withMessage("El campo nombre_rom es obligatorio")
        .notEmpty().withMessage("El campo nombre_rom no puede estar vacío"),
    check("id_periodo")
        .exists().withMessage("El id de periodo es obligatorio")
        .notEmpty().withMessage("El d de periodo no puede estar vacío"),
    check("apellido_paterno_rom")
        .exists().withMessage("El campo apellido_paterno_rom es obligatorio")
        .notEmpty().withMessage("El campo apellido_paterno_rom no puede estar vacío"),
    check("apellido_materno_rom")
        .exists().withMessage("El campo apellido_materno_rom es obligatorio")
        .notEmpty().withMessage("El campo apellido_materno_rom no puede estar vacío"),
    check("cargo_rom")
        .exists().withMessage("El campo cargo_rom es obligatorio")
        .notEmpty().withMessage("El campo cargo_rom no puede estar vacío"),
    check("correo_rom")
        .exists().withMessage("El campo correo_rom es obligatorio")
        .isEmail().withMessage("El campo correo_rom debe ser un correo electrónico válido"),
    check("telefono_rom")
        .exists().withMessage("El campo telefono_rom es obligatorio")
        .isLength({ min: 10, max: 10 }).withMessage("El campo telefono_rom debe tener 10 dígitos"),
    check("ruta_documento"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];



module.exports = {
    inicio_sesion_validator,
    nuevo_tramite_validator,
    dependencia_validator,
    //Tramites
    tramites_dependencia_validator,
    tramite_validator,
    tramite_datos_generales,
    tramite_seccion_dos_validator,
    comentario_validator,
    correo_validator,
    //Seccion dos
    seccion_dos_validator,
    seccion_dos_a_validator,
    seccion_dos_b_validator,
    seccion_dos_b_uno_validator,
    seccion_dos_b_dos_validator,
    seccion_dos_b_tres_validator,
    seccion_dos_b_cuatro_validator,
    seccion_dos_b_cinco_validator,
    seccion_dos_b_seis_validator,
    seccion_dos_b_siete_validator,
    seccion_dos_b_ocho_validator,
    seccion_dos_b_nueve_validator,
    seccion_dos_b_diez_validator,
    seccion_dos_b_once_validator,
    //Seccion tres
    seccion_tres_validador,
    //Seccion cuatro
    seccion_cuatro_pregunta_2_validator,
    seccion_cuatro_pregunta_3_validator,
    seccion_cuatro_pregunta_41_validator,
    seccion_cuatro_respuesta_validator,
    seccion_cuatro_pregunta_7_validator,
    seccion_cuatro_pregunta_8_validator,
    seccion_cuatro_pregunta_13_validator,
    //Observaciones
    observaciones_validator,
    observacion_validator,
    //Periodos
    nuevo_periodo_validator,
    actualizar_periodo_validator,
    omision_validator
}
