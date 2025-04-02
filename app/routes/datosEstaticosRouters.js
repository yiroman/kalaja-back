const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken');
const RolModel = require('../models/RolModel');
const DependenciaModel = require('../models/DependenciasModel');
const UsuarioEstatusModel = require('../models/UsuarioEstatusModel')
const { middlewareToken } = require('../config/middlewares');

router.get('/dependencias', middlewareToken, async (req, res) => {
    try{
        const dependencias = await DependenciaModel.find({})
      
        res.json(dependencias)

    }catch(e){
        res.json(`error: No jalo ${e}`)
    }
})

router.get('/roles', middlewareToken, async (req, res) => {
    try{
        const roles = await RolModel.find({clave_rol: {$nin: [27,74]}})
        
        res.json(roles)

    }catch(e){
        res.json(`error: No jalo ${e}`)
    }
})

router.get('/usuario_estatus', middlewareToken, async (req, res) => {
    try{
        const usuarioEstatus = await UsuarioEstatusModel.find({})
        
        res.json(usuarioEstatus)

    }catch(e){
        res.json(`error: No jalo ${e}`)
    }
})

module.exports = router;