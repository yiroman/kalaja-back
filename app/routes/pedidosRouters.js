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
                producto: p.producto,
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


//actualizar un pedido
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('📌 ID recibido para actualizar:', id);

        if (!id) {
            return res.status(400).json({ message: 'ID del pedido no proporcionado' });
        }

        // Verificar si el pedido existe antes de actualizar
        const pedidoExistente = await PedidoModel.findById(id);
        if (!pedidoExistente) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // 🔹 Usar `$set` para actualizar correctamente el array de productos
        const pedidoActualizado = await PedidoModel.findOneAndUpdate(
            { _id: id },
            { $set: req.body }, // 🔥 Esto asegura que los productos se actualicen correctamente
            { new: true, runValidators: true }
        );

        if (!pedidoActualizado) {
            return res.status(500).json({ message: 'No se pudo actualizar el pedido' });
        }

        console.log('✅ Pedido actualizado:', pedidoActualizado);

        res.json({ message: 'Pedido actualizado con éxito', pedido: pedidoActualizado });

    } catch (error) {
        console.error('❌ Error al actualizar el pedido:', error);
        res.status(500).json({ message: 'Error al actualizar el pedido', error: error.message || error });
    }
});


//cambiar el estado de un pedido
router.put('/:id/estado', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!id || !estado) {
            return res.status(400).json({ message: 'ID del pedido y estado no proporcionados' });
        }

        // Verificar si el pedido existe antes de actualizar
        const pedidoExistente = await PedidoModel.findById(id);
        if (!pedidoExistente) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Actualizar el estado del pedido
        const pedidoActualizado = await PedidoModel.findOneAndUpdate(
            { _id: id },
            { estado },
            { new: true, runValidators: true }
        );

        if (!pedidoActualizado) {
            return res.status(500).json({ message: 'No se pudo actualizar el estado del pedido' });
        }

        console.log('✅ Estado del pedido actualizado:', pedidoActualizado);

        res.json({ message: 'Estado del pedido actualizado con éxito', pedido: pedidoActualizado });

    } catch (error) {
        console.error('❌ Error al actualizar el estado del pedido:', error);
        res.status(500).json({ message: 'Error al actualizar el estado del pedido', error: error.message || error });
    }
});




module.exports = router;