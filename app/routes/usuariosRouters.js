const express = require('express'),
    jwt = require('jsonwebtoken'),
    winston = require("../config/winston"),
    multer = require('multer'),
    log = require('../generales/log'),
    UsuarioModel = require('../models/UsuarioModel'),
    {middleware_token, middleware_roles} = require('../config/middlewares'),
    {inicio_sesion_validator} = require('../utils/validators')



const router = express.Router();
const fs = require("fs");
const { crearError } = require('../utils/errores');


//Inicio de sesion
router.post('/login', 
    inicio_sesion_validator,
    async (req, res) =>{   
    const {body} = req //machea con el validator
    const usuario =  await UsuarioModel.findOne({$and : [{correo: body.correo}, {contrasena: body.contrasena}]})
        console.log(usuario)
    if(usuario == null){

        const error = {
            code: 404,
            message: "Correo o contraseña incorrectos"
        }
        res.status(404).json(error);
    }

    if(usuario.clave_estatus != 1){
        const error = {
            code: 404,
            message: "Usuario deshabilitado contacte con el adminsitrador"
        }
        res.status(404).json(error);
    }

    const fechaFin = new Date();
    
    const datosToken = {
        fechaFin : fechaFin.getTime(),
        id: usuario._id,
        nombre_rol: usuario.nombre_rol,
        clave_rol: usuario.clave_rol,
        correo: usuario.correo,
        nombre_completo: `${usuario.nombre} ${usuario.ap_paterno} ${usuario.ap_materno}`
    };

    winston.log({
        level: 'info',
        message: `${req.ip} - [${new Date().toString().replace(" (Central Standard Time)", "")}] - ${req.headers['user-agent']} - ${datosToken.nombre_completo} - ${datosToken.correo} - Entrando a sistema`
    });

    const token = jwt.sign(datosToken, process.env.JWT_KEY);

        console.log(token)
    if(UsuarioModel.updateOne({_id: usuario._id},{token: token})){ //si se actualiza el usuario...
        req.session.token = token
        const error = {
            code: 200,
            message: "Inicio de sesion correcto"
        }
        res.status(200).json(error);
    }
})

router.get('/validar_sesion',
    middleware_token,
    console.log( 'validar_sesion'),
    async (req, res) =>{
        return res.json({
            code: 200,
            message: "Success"
        })
    }
)

router.get('/logout',async (req, res) => {
    req.session.token = null;
    res.json({
        code: 200,
        message: "Sesion cerrada"
    })
})

router.get('/obtenerUsuario',
    async (req, res) => {
        try{
            const token = req.session.token;
            console.log('token en obtener usuario', token)
        if(token){
            const decoded = jwt.verify(token, process.env.JWT_KEY)
            const usuario = await UsuarioModel.findById(decoded.id)

            usuarioData = {
                nombre_completo: `${usuario.nombre} ${usuario.ap_paterno} ${usuario.ap_materno}`,
                nombre_rol: usuario.nombre_rol,
                auth: true
            }


            res.json(usuarioData)
        }

        crearError(res, 'NO_TOKEN')

        }catch(e){
            console.log('error' + e)
        }
    })


//Obtener usuarios
router.get('/obtenerUsuarios',
    middleware_token,
    async (req, res) => {
    const token = req.session.token;
    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);        
        let usuario
        switch(decoded.clave_rol) {
            case 27:
                usuario = await UsuarioModel.find({clave_rol: { $ne: 27}})
                res.json(usuario)
                break;
                case 35:
                    usuario = await UsuarioModel.find(
                        {$or : [
                            {"clave_rol": {$eq: 48}}, 
                            {"clave_rol": {$eq: 53}},
                            {"clave_rol": {$eq: 35}},
                        ]})
                res.json(usuario)
                break
            default:
                const error = {
                    code: 404,
                    message: "El rol no es valido"
                }
                res.status(404).json(error);
        }
}else{
    const error = {
        code: 404,
        message: "No hay token"
    }
    res.status(404).json(error);
}
})

router.post('/crearUsuario',
    middleware_token,
    async (req, res) => {
        try{
            const usuario = await UsuarioModel.findOne({correo: req.body.correo})

            if(usuario){
                const error = {
                    code: 404,
                    message: "El usuario ya existe"
                }
                res.status(404).json(error);
            }
        
                // Crear el nuevo usuario
            const usuario_nuevo = new UsuarioModel(req.body);
            await usuario_nuevo.save();
           return res.status(201).json(usuario_nuevo);
            
        }catch(e){
            const error = {
                code: 404,
                message: `No se creo el usuario ${e}`
            }
            res.status(404).json(error);
        }
})

router.get('/verificarCorreo/:correo',
    async (req, res) =>{
        try{
            const correo = req.params.correo

            if(!correo){
                const error = {
                    error: 400,
                    message: "Error al obtener el correo"
                }
                res.json(error)
            }

            const correoExiste = await UsuarioModel.findOne({correo: correo})

            if(correoExiste){
                return res.json(true)
            }else{
                return res.json(false)
            }

        }catch(e){

        }
    }
)


//Actualizar Usuario
router.put('/actualizarUsuario', 
    middleware_token,
    async (req, res) =>{
        
        try{

        const {id_usuario} = req.body


        if(!await UsuarioModel.findById(id_usuario)){
            const error = {
                code: 402,
                message: "No existe ese usuario"
            }
            res.status(402).json(error)
        }

        //DATO: Si en algun momento el correo es declarado como "unico" dentro de mongoose, se crea un indice que no se cambia hasta borrarlo manualmente
        
        let datosNuevos = {

            "correo" : req.body.correo,

            "nombre": req.body.nombre,
            "ap_paterno": req.body.ap_paterno,
            "ap_materno": req.body.ap_materno,

            "cargo": req.body.cargo,

            "clave_dependencia": req.body.clave_dependencia,
            "nombre_dependencia": req.body.nombre_dependencia,

            "telefono": req.body.telefono,

        }



            const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(
                id_usuario, { $set: { ...datosNuevos } }, {new: true})
            
            
            console.log(usuarioActualizado)

            res.json({usuarioActualizado})
        }catch(e){
            const error = {
                code: 404,
                message: `No se actualizo ${e}`
            }
            res.status(404).json(error);
        }
})

//arreglo de usuarios
router.patch('/actualizarEstatus',
    middleware_token,
    async (req, res) =>{
      try{
        const {idUsuario, clave_estatus, nombre_estatus, justificacion_estatus} = req.body

        await UsuarioModel.findByIdAndUpdate(
            idUsuario, {
                $set: {
                    "clave_estatus": clave_estatus,
                    "nombre_estatus": nombre_estatus,
                    "justificacion_estatus": justificacion_estatus}},
                    {new: true})
        
        res.send({mensaje: "Actualizacion de estatus correcto"})
        }catch(e){
            const error = {
                code: 404,
                message: `No se actualizo el estatus ${e}`
            }
            res.status(404).json(error);
        }
})

router.patch('/actualizarContrasena',
    middleware_token,
    async (req, res) =>{
        const {body} = req
        const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(body.idUsuario,
            {$set:{ contrasena:  body.contrasenaModificada}},
            {new: true}
        )        
        res.json({mensaje: "Actualizacion de contraseña correcto"})

})

/* 
    Funciones de utilidad
*/

router.post('/verificarCorreo',
    middleware_token,
    async (req, res) => {
        
        const {body} = req
        const correo = await UsuarioModel.find({correo: body.correo})

        if(correo){
            const error = {
                code: 404,
                message: `El correo ya existe`
            }
            res.status(404).json(error);
        }

    }
)


router.get('/obtenerCorreos',
    middleware_token,
    async (req, res) => {
        const token = req.session.token;
        if (!token) {
            return res.status(404).json({
                code: 404,
                message: "No hay token"
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);

            // Verificar si el usuario tiene rol ROM
            if (decoded.clave_rol === 53) {
                // Buscar usuarios con rol Administrador y Operador
                const correos = await UsuarioModel.find(
                    { clave_rol: { $in: [35, 48] } }, // Filtrar por roles
                    { correo: 1, _id: 0 } // Solo devolver el campo correo
                );
                
                // Devolver los correos encontrados
                return res.json(correos.map(user => user.correo));
            }

            // Si no tiene permiso
            return res.status(403).json({
                code: 403,
                message: "No tienes permiso para acceder a esta información"
            });

        } catch (error) {
            return res.status(500).json({
                code: 500,
                message: "Error al procesar la solicitud",
                error: error.message
            });
        }
    }
);



// //*****************************************************
// //***************** FOTOS DE PERFIL *******************
const storageImagePerfil = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/perfil");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const partes = file.mimetype.split("/");
        cb(null, uniqueName + "." + partes[1]);
    }
});


const uploadImagePerfil = multer({
    storage: storageImagePerfil,
    fileFilter: (req, file, cb) => {
        const extensiones =['jpeg','jpg','png'];
        const partes = file.mimetype.split("/");
        const resultado = extensiones.includes(partes[1]);
        if(resultado){
            cb(null, true);
        }
        else{
            cb("El archivo cargado no es un archivo compatible extensiones validas: jpeg, jpg y png");
        }
    }
});


router.post('/upload',
    uploadImagePerfil.single('perfil'),
    middleware_token,
    async (req, res) =>{
    try{
        if(!req.file){
            crearError(res, "No se cargo la imagen")
        }else{
            res.json({message: "No se puede cargar la imagen"})
        }
    }catch(e){
        crearError(res, `${e}`)
    }
    })


router.post('/editar_foto_perfil',
    middleware_token,
    uploadImagePerfil.single('perfil'), (req, res) => {
    const { nombre_anterior } = req.body;

    if (!req.file) {
        res.status(400).json({ message: "No se pudo cargar la imagen" });
    }

    if(req.file){
        if(nombre_anterior){
            fs.unlink(`./uploads/perfil/${nombre_anterior}`, (error) =>{
                if(error){
                    res.send(error)
                }
            })
            
        }
    }else{
        crearError(res, "nose pudo cargar la imagen")
    }

});

module.exports = router;