const express = require('express'),
    jwt = require('jsonwebtoken'),
    winston = require("../config/winston"),
    multer = require('multer'),
    UsuarioModel = require('../models/UsuarioModel'),
    BitacoraOperadoresModel = require("../models/BitacoraOperadoresModel"),
    {middlewareEstatusUsuario, middlewareToken, middlewareRoles} = require('../config/middlewares'),
    {inicio_sesion_validator, correo_validator, curp_validator} = require('../validators/loginValidator'),
    {s} = require("../validators/usuariosValidators") //Falta agregar
const router = express.Router();
const { respuestaHTTP } = require('../utils/errores');
const { crearTokenCookie } = require('../config/jwtConfig');
const { connectRedis } = require('../config/redis');
const { SUPERADMINISTRADOR, ADMINISTRADOR } = require('../config/roles');


//Inicio de sesion
router.post('/login', 
    inicio_sesion_validator,
    async (req, res) =>{

    const {body} = req //machea con el validator
    const usuario =  await UsuarioModel.findOne({$and : [{correo: body.correo}, {contrasena: body.contrasena}]})

    if(usuario == null){
        return respuestaHTTP(res, 401, "El correo o la contraseña es incorrecto")
    }

    if(usuario.clave_estatus != 1){
        return respuestaHTTP(res, 401, "El usuario esta deshabilitado, por favor, comunicate con el administrador" )
    }
    
    crearTokenCookie(req, res, usuario)
    
    winston.log({
        level: 'info',
        message: `${req.ip} - [${new Date().toString().replace(" (Central Standard Time)", "")}] - ${req.headers['user-agent']} - ${usuario.nombre_completo} - ${usuario.correo} - Entrando a sistema`
    });


    let datosBitacora = {
        estatus: "",
        cliente: req.headers['user-agent'],
        id_usuario: usuario._id,
        nombre: usuario.nombre_completo,
        accion: 'Entrando al sistema',
        clave_dependencia: usuario.clave_dependencia,
        clave_rol: usuario.clave_rol,
        correo: usuario.correo
    };

    new BitacoraOperadoresModel(datosBitacora).save(); //Se guarda en la bitacora los datos necesarios

    if(UsuarioModel.updateOne({_id: usuario._id})){ //si se actualiza el usuario...
        respuestaHTTP(res, 200, "Inicio de sesión correcto")
    }
})

router.get('/validar_sesion',
    middlewareToken,
    async (req, res) =>{
        respuestaHTTP(res, 200, "Correcto")
    }
)

router.get('/validar_sesion_admin',
    middlewareToken,
    middlewareRoles([27, 35]),
    async (req, res) =>{
        respuestaHTTP(res, 200, "Correcto")
    }
)

router.get('/logout', middlewareToken, async (req, res) => {
    if (req.sessionID) {
        const redisClient = await connectRedis()
        await redisClient.del(`sess:${req.sessionID}`); // Elimina la sesión en Redis
    }
    res.clearCookie("connect.sid"); // Borra la cookie del navegador
    req.session.destroy((error) => {
        if(error){
            respuestaHTTP(res, 400, `Error al cerrar la sesion`)
        }
        res.clearCookie("connect.sid")
        respuestaHTTP(res, 200, "Sesión guardada")
    })
    
})

router.get('/obtener_informacion_usuario',
    middlewareToken,
    async (req, res) => {
        try{
            console.log('token' + req.token)
            const token = req.token
            const usuario = await UsuarioModel.findById(token.id)

                usuarioData = {
                    nombre_completo: `${usuario.nombre} ${usuario.ap_paterno} ${usuario.ap_materno}`,
                    clave_rol: usuario.clave_rol,
                    clave_dependencia: usuario.clave_dependencia,
                    auth: true
                }

            respuestaHTTP(res, 200, "Informacion del usuario encontrada", usuarioData)                
        }catch(e){
            respuestaHTTP(res, 400, `Error al obtener usuario: ${e}`)    
        }
    })


//Obtener usuarios
router.get('/obtener_usuarios',
    middlewareToken,
    middlewareRoles([SUPERADMINISTRADOR, ADMINISTRADOR]),
    async (req, res) => {
    try{
    const token = req.token
    let usuarios
    switch(token.clave_rol) {
            case 27:
                usuarios = await UsuarioModel.find({clave_rol: { $ne: 27}})
                respuestaHTTP(res, 200, "Se encontrar exitosamente los usuarios", usuarios)
                break;
                case 35:
                    usuarios = await UsuarioModel.find(
                        {$or : [
                            {"clave_rol": {$eq: 48}}, 
                            {"clave_rol": {$eq: 74}},
                            {"clave_rol": {$eq: 35}},
                        ]})
                respuestaHTTP(res, 200, "Se encontrar exitosamente los usuarios", usuarios)
                break
            default:
               respuestaHTTP(res, 401, "ROL DESCONOCIDO")
        }
    }catch(e){
        respuestaHTTP(res, 400, `Error en obtener los usuarios`)
    }

})

router.post('/crear_usuario',
    middlewareToken,
    middlewareRoles([SUPERADMINISTRADOR, ADMINISTRADOR]),
    async (req, res) => {
        try{
            const usuario = await UsuarioModel.findOne({correo: req.body.correo})

            if(usuario){
                respuestaHTTP(res, 404, "El usuario ya existe")
            }
        
            // Crear el nuevo usuario
            const usuario_nuevo = new UsuarioModel(req.body);
            await usuario_nuevo.save();
            respuestaHTTP(res, 200, "Se guardo con exito el usuario")
            
        }catch(e){
            respuestaHTTP(res, 500, `Error al crear usuario`)
        }
})

//Actualizar Usuario
router.patch('/actualizar_usuario', 
    middlewareToken,
    middlewareRoles([SUPERADMINISTRADOR, ADMINISTRADOR]),
    async (req, res) =>{
        try{

            const {id_usuario} = req.body


            if(!await UsuarioModel.findById(id_usuario)){
                respuestaHTTP(res, 402, "No existe el usuario que desea actualizar")
            }

            let datosNuevos = {
                "correo" : req.body.correo,
                "nombre": req.body.nombre,
                "ap_paterno": req.body.ap_paterno,
                "ap_materno": req.body.ap_materno,
                "curp": req.body.curp,
                "clave_dependencia": req.body.clave_dependencia,
            }

            const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(
                id_usuario, { $set: { ...datosNuevos } }, {new: true})
                

            respuestaHTTP(res, 200, "Se actualizo el usuario", usuarioActualizado)
            
        }catch(e){
            respuestaHTTP(res, 500, `Error al actualizar el usuario`)
        }
})

//arreglo de usuarios
router.patch('/actualizar_estatus',
    middlewareToken,
    middlewareRoles([SUPERADMINISTRADOR, ADMINISTRADOR]),
    async (req, res) =>{
      try{
            const {id_usuario, clave_estatus, nombre_estatus, justificacion_estatus} = req.body

            await UsuarioModel.findByIdAndUpdate(
                id_usuario, {
                    $set: {
                        "clave_estatus": clave_estatus,
                        "nombre_estatus": nombre_estatus,
                        "justificacion_estatus": justificacion_estatus}},
                        {new: true})
            
            respuestaHTTP(res, 200, "Se actualizo correctamente el estatus del usuario")

        }catch(e){
            respuestaHTTP(res, 500, `Error al actualizar el estatus del usuario`)
        }
})

router.patch('/actualizar_contrasena',
    middlewareToken,
    middlewareRoles([SUPERADMINISTRADOR, ADMINISTRADOR]),
    async (req, res) =>{
        try{
            const {body} = req
            await UsuarioModel.findByIdAndUpdate(body.id_usuario,
                {$set:{ contrasena:  body.contrasenaModificada}},
                {new: true}
            )        
            respuestaHTTP(res, 200, "Se actualizo correctamente la contraseña")
        }catch(e){
            respuestaHTTP(res, 500, `Error al actualizar la contraseña`)
        }
})

/* 
    Funciones de utilidad
*/

router.get('/verificar_correo/:correo', async (req, res) => {
    try {
      const correo = req.params.correo;
      
      if (!correo) {
        return res.status(400).json({ message: 'Correo no proporcionado' });
      }
  
      const correoExiste = await UsuarioModel.findOne({ correo: correo });
  
      if (correoExiste) {
        return res.json(true);  // El correo ya existe
      } else {
        return res.json(false);  // El correo no existe
      }
    } catch (e) {
      console.error('Error al verificar el correo:', e);
      return res.status(500).json({ message: 'Error al verificar el correo' });
    }
  });

router.get('/verificar_curp/:curp', async (req, res) => {
    try {
      const curp = req.params.curp;
      
      if (!curp) {
        return res.status(400).json({ message: 'Correo no proporcionado' });
      }
  
      const curpExiste = await UsuarioModel.findOne({ curp: curp });
  
      if (curpExiste) {
        return res.json(true);  // El curp ya existe
      } else {
        return res.json(false);  // El curp no existe
      }
    } catch (e) {
      return res.status(500).json({ message: 'Error al verificar el correo' });
    }
  });



module.exports = router;