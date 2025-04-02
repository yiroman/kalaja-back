const jwt = require('jsonwebtoken');
const { respuestaHTTP } = require('../utils/errores');

/**
 * @param { res } -> Respuesta de la ruta  
 * @param { usuario } -> Recibe los datos del usuario 
 */
const crearTokenCookie = (req, res, usuario) => {
    const token = jwt.sign({
        id: usuario._id,
        nombre_completo: `${usuario.nombre} ${usuario.ap_paterno} ${usuario.ap_materno}`,
        correo: usuario.correo,
        clave_rol: usuario.clave_rol,
        clave_dependencia: usuario.clave_dependencia,
        nombre_rol: usuario.nombre_rol
    }, process.env.JWT_KEY, { expiresIn: '4h' });

    req.session.kalaja = { token };

    return new Promise((resolve, reject) => {
        req.session.save(err => {
            if (err) return reject(err);
            resolve();
        });
    });
};

const obtenerDatosUsuario = (token) => {
    return jwt.verify(token, process.env.JWT_KEY,
        {
            expiresIn: "4h",
            // issuer: 'kalaja-api'
        }
    )
}

/**
 * 
 * @param { token } -> Recibira el token  
 * @returns 
 */

const verificarToken = async (res, token) => {
    try{
        return jwt.verify(token, process.env.JWT_KEY,
            {
                expiresIn: "4h",
                // issuer: 'kalaja-api'
            }
        )

    }catch(e){
        respuestaHTTP(res, 401, `Error en verificar el token ${e}`)
    }   
}

module.exports = {verificarToken, crearTokenCookie, obtenerDatosUsuario}