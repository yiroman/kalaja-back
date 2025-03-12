var express = require('express');
var router = express.Router()
const jwt = require('jsonwebtoken');
const RolModel = require('../models/RolModel');
const {errorAd} = require('../utils/errores');
const { middleware_admin, middleware_token } = require('../config/middlewares');
const log = require('../generales/log');


router.get('/', middleware_token, async (req, res) => {
    try{
        const roles = await RolModel.find({})
        res.json(roles)
    }catch(e){
        errorAd(res, 'ERROR_DEPENDENCIA')
    }
})


router.get('/menu', (req, res) => {
    const token = req.session.token;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const tipoDependencia = decoded.tipo_dependencia;

    let menu;
    switch (decoded.clave_rol) {
        // Superadministrador
        case 27:
            menu = [
                {
                    navCap: 'Inicio',
                },
                {
                    displayName: 'Inicio',
                    iconName: 'home',
                    route: '/starter',
                },
                {
                    displayName: 'Usuarios',
                    iconName: 'user',
                    route: '/usuarios',
                },
                {
                    displayName: 'Pedidos',
                    iconName: 'box',
                    route: '/pedidos',
                },
            ];
            break;
        // Administrador
        case 35:
            menu = [
                {
                    navCap: 'Inicio',
                },
                {
                    displayName: 'Inicio',
                    iconName: 'home',
                    route: '/starter',
                },
                {
                    displayName: 'Usuarios',
                    iconName: 'user',
                    route: '/usuarios',
                },
            ];
            break;
        // Operador
        case 48:
            menu = [
                {
                    navCap: 'Inicio',
                },
                {
                    displayName: 'Inicio',
                    iconName: 'home',
                    route: '/starter',
                },
                {
                    displayName: 'Trámites / Servicios',
                    iconName: 'file',
                    route: '/tramites',
                },
                {
                    displayName: 'Excepciones',
                    iconName: 'file',
                    route: '/ver_excepciones',
                },
               
            ];
            break;
        // ROM
        case 53:
            menu = [
                {
                    navCap: 'Dashboard',
                },
                {
                    displayName: 'Inicio',
                    iconName: 'home',
                    route: '/starter',
                }
            ]

             
            break;
    }
    res.json(menu);
});

module.exports = router;