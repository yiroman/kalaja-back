const express = require('express'),
    jwt = require('jsonwebtoken'),
    winston = require("../config/winston"),
    multer = require('multer')

const PedidoModel = require('../models/PedidoModel');



const router = express.Router();
const fs = require("fs");
const { crearError } = require('../utils/errores');


router.post('/',  async (req, res) => {
    try {
        const {productos, metodoPago, fechaEntrega, notas, cliente } = req.body;

        // Validar que se envíen los datos requeridos
        if ( !productos || productos.length === 0) {
            return res.status(400).json({
                code: 400,
                message: "Faltan datos obligatorios"
            });
        }

        // Calcular el total del pedido
        let total = 0;
        const productosProcesados = productos.map(p => {
            const subtotal = p.cantidad * p.precioUnitario;
            total += subtotal;
            return {
                producto: p.id_producto,
                cantidad: p.cantidad,
                precioUnitario: p.precioUnitario,
                subtotal
            };
        });

        // Crear el nuevo pedido
        const nuevoPedido = new PedidoModel({
            numeroPedido: `PED-${Date.now()}`, // Genera un identificador único
            productos: productosProcesados,
            total,
            metodoPago,
            fechaEntrega,
            notas,
            cliente
        });

        await nuevoPedido.save();
        return res.status(201).json(nuevoPedido);

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            code: 500,
            message: `No se pudo crear el pedido: ${e.message}`
        });
    }
});


router.get('/', async (req, res) => {
    try {
        const pedidos = await PedidoModel.find({});
        return res.json(pedidos);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            code: 500,
            message: `No se pudo obtener los pedidos: ${e.message}`
        });
    }
});





module.exports = router;