const express = require('express'),
    jwt = require('jsonwebtoken'),
    winston = require("../config/winston"),
    multer = require('multer')



const router = express.Router();
const fs = require("fs");
const { crearError } = require('../utils/errores');



router.post('/crear_pedido', async (req, res) => {
    try {
        const { id_usuario, id_producto, cantidad, total } = req.body;
        const nuevoPedido = await PedidoModel.create({
            id_usuario, id_producto, cantidad, total
        });
        res.json(nuevoPedido);
    } catch (error) {
        crearError(res, 'ERROR_CREAR_PEDIDO');
    }
} );



router.get('/', obtenerPedidos);
router.get('/:id', obtenerPedidoPorId);
router.put('/:id', actualizarPedido);
router.delete('/:id', eliminarPedido);

module.exports = router;