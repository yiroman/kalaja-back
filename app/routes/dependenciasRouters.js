var express = require('express');

const DependenciaModel = require('../models/DependenciasModel');
const { middlewareToken } = require('../config/middlewares');
const { errorAd } = require('../utils/errores');

var router = express.Router();

router.get('/', async (req, res) => {
        try{
            const dependencias = await DependenciaModel.find({})
            res.json(dependencias)
        }catch(e){
            errorAd(res, 'ERROR_DEPENDENCIA')
        }
});

router.get('/:clave', middlewareToken, async (req, res) => {
    try {
        const claveDependencia = parseInt(req.params.clave, 10); // Asegúrate de convertir la clave a número
        const dependencia = await DependenciaModel.findOne({ clave_dependencia: claveDependencia });

        if (!dependencia) {
            return res.status(404).json({ message: 'Dependencia no encontrada' });
        }

        res.json(dependencia);
    } catch (e) {
        console.error(e);
        errorAd(res, 'ERROR_DEPENDENCIA');
    }
});


module.exports = router;