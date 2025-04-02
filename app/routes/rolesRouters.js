var express = require('express');
const router = express.Router()
const RolModel = require('../models/RolModel');
const { middlewareToken } = require('../config/middlewares');
const { respuestaHTTP } = require('../utils/errores');


// router.get('/', middlewareToken, async (req, res) => {
//     try{
//         const roles = await RolModel.find({})
//         res.json(roles)
//     }catch(e){
//         respuestaHTTP(res, 400, "Error al obtener los roles", e)
//     }
// })


router.get('/menu',middlewareToken, (req, res) => {
    const token = req.token;

    let menu;
    switch (token.clave_rol) {
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
                {
                    displayName: 'Productos',
                    iconName: 'box',
                    route: '/productos',
                }
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
                }
            ];
            break;
        // Organizador
        case 48:
            menu = [
                {
                    navCap: 'Inicio',
                },
                {
                    displayName: 'Inicio',
                    iconName: 'home',
                    route: '/starter',
                }
               
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