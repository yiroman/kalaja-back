var express = require('express'),
    multer = require('multer'),
    fs = require('fs');
const UsuarioEstatusModel = require('../models/UsuarioEstatusModel');
const { middlewareToken } = require('../config/middlewares');

var router = express.Router();

router.get('/', middleware_admin, async (req, res) =>{
    try{
    const estatus = await UsuarioEstatusModel.find()
    res.json(estatus)
    }catch(e){
    }
});


router.get('/:id', middlewareToken, async (req, res) =>{
    try{
        const { id } = req.params;
        const estatus = await UsuarioEstatusModel.findById(id)
        res.json(estatus)
    }catch(e){
    }
});









module.exports = router;