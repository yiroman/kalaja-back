const jwt = require('jsonwebtoken'),
    UsuarioModel = require('../models/UsuarioModel');

const middleware_enlace = function(req, res){
    const error = {
        error: 401,
        mensaje: "Unauthorized"
    };
    try{
        const token = req.session.jwt;
        if(token) {
            return UsuarioModel.findOne({ token: token, estatus: "Habilitado" })
            .then(usuario => {
                if(usuario != null){
                    const decoded = jwt.verify(token, process.env.JWT_KEY);
                    const fechaFin = new Date(decoded.fechaFin);
                    const rol = decoded.rol.clave;
                    const fechaActual = new Date();
                    if(fechaActual.getTime() >= fechaFin.getTime()){
                        return new Promise((_, reject)=>{
                            reject(error);
                        });
                    }
                    else if(rol != 53){
                        return new Promise((_, reject)=>{
                            reject(error);
                        });
                    }
                    else{
                        return new Promise((resolve, _)=>{
                            resolve(true);
                        });
                    }
                }
                else{
                    return new Promise((_, reject)=>{
                        reject(error);
                    });
                }
            });
        }
        else{
            return new Promise((_, reject)=>{
                reject(error);
            });
        }
    }
    catch(err){
        return new Promise((_, reject)=>{
            reject(error);
        });
    }
}

module.exports = middleware_enlace;