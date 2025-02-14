const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken');
const RolModel = require('../models/RolModel');
const DependenciaModel = require('../models/DependenciasModel');
const UsuarioEstatusModel = require('../models/UsuarioEstatusModel')
const { middleware_token } = require('../config/middlewares');

router.get('/', middleware_token, async (req, res) => {
    try{
        const roles = await RolModel.find({clave_rol: { $ne: 27}})
        const dependencias = await DependenciaModel.find({})
        const usuarioEstatus = await UsuarioEstatusModel.find({})
        
        const data = {
            roles,
            dependencias,
            usuarioEstatus
        }
        res.json(data)

    }catch(e){
        res.json(`error: No jalo ${e}`)
    }
})

module.exports = router;