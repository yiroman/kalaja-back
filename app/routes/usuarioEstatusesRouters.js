var express = require('express'),
    multer = require('multer'),
    fs = require('fs');
const UsuarioEstatusModel = require('../models/UsuarioEstatusModel');
const { middleware_admin, middleware_token } = require('../config/middlewares');
const { errorAd } = require('../utils/errores');

var router = express.Router();

router.get('/', middleware_admin, async (req, res) =>{
    try{
    const estatus = await UsuarioEstatusModel.find()
    res.json(estatus)
    }catch(e){
        errorAd(res, 'ERROR_USUARIO_ESTATUSES')
    }
});


router.get('/:id', middleware_token, async (req, res) =>{
    try{
        const { id } = req.params;
        const estatus = await UsuarioEstatusModel.findById(id)
        res.json(estatus)
    }catch(e){
        errorAd(res, 'ERROR_ESTATUS')
    }
});









module.exports = router;