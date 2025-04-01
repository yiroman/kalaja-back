const jwt = require('jsonwebtoken'),
    express = require('express'),
    UsuarioModel = require('../models/UsuarioModel');
const {crearError} = require('../utils/errores')
var app = express();
const middleware_token = async (req, res, next) =>{
    try{
        const token = req.session.token;
        console.log('token', token)
        if(app.get('env') ==='dev'){
            if(!token){
                crearError(res, 'No hay token en desarrollo')
                return
            }
        }else{
            if(!token){
                crearError(res, 'No hay token en produccion')
                return
            }
        }
        if(token == null){
            const error = {
                code: 401,
                message: "No authorized"
            }
            res.status(401).json(error);
            return
        }
        
        const usuario = await UsuarioModel.findOne({token: token, estatus: 'Habilitado'})

        if(usuario != null){
            const decoded = jwt.verify(token, process.env.JWT_KEY)
            const fechaFin = new Date(decoded.fechaFin);
            const fechaActual = new Date();
            if (fechaActual.getTime() >= fechaFin.getTime()){
                const error = {
                    code: 401,
                    message: "Token has been expired"
                }
                res.status(404).json(error);
            }
        }
        
        next()
    }catch(e){
        const error = {
            code: 404,
            message: "Correo o contraseña incorrectos + " + e.message
        }
        res.status(404).json(error);
    }
}

const middleware_admin = async (req, res, next) => {
    const token = req.session.token
        if(!token){
            crearError(res, 'No hay token')
            return
        }
        const decoded = jtw.verify(token, process.env.JWT_KEY)
        const fechaFin = new Date(decoded.fechaFin);
        const fechaActual = new Date();
        const rol = decoded.rol.clave;
        if(( fechaActual.getTime() >= fechaFin.getTime() ) &&(rol!=27 && rol != 35)){
            crearError(res, 'ROL_AUTH_INVALID')
        }
        next()
}

const middleware_roles = (roles) => (req, res, next)  =>{
    const token = req.session.token;
    if(token){
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        const jwtRol = decoded.clave_rol

        if(roles.includes(jwtRol)){
            next()
        }else{
            crearError(res, 203)
        }
    }else{
        crearError(res, 204)
    }
}


module.exports = {middleware_roles, middleware_token, middleware_admin};

