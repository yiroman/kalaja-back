const jwt = require('jsonwebtoken'),
    UsuarioModel = require('../models/UsuarioModel');
const {respuestaHTTP} = require('../utils/errores');
const log = require('../generales/log');

const middlewareToken = async (req, res, next) =>{
    try{
        const { token } = req.body;
        if(token == null){
            respuestaHTTP(res, 401, "No existe el token")
            return
        }
        
        const decoded = jwt.verify(token, process.env.JWT_KEY,
                    {
                        expiresIn: "4h",
                        issuer: process.env.EMISOR_JWT    
                    }
        )

        req.token = decoded

        next()
    }catch(e){
        respuestaHTTP(res, 401, `Acceso no autorizado`)
    }
}

const middlewareEstatusUsuario = async(req, res, next) =>{
    try{
        const {token} = req.body
        const usuario = await UsuarioModel.findOne({estatus: 'Habilitado'})
        if(usuario == null){
            respuestaHTTP(res, 200, "Usuario Inhabilitado")
        }

    }catch(e){
        respuestaHTTP(res, 401, `No autorizado ${e}`)
    }
}


const middlewareRoles = (roles) => (req, res, next)  =>{
    const { token } = req.body
    if(token){
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        const jwtRol = decoded.clave_rol

        if(roles.includes(jwtRol)){
            next()
        }else{
            respuestaHTTP(res, 203, "Este rol no esta autorizado")
        }
    }else{
        respuestaHTTP(res, 204, "No existe el token con el que se quiere logguear")
    }
}