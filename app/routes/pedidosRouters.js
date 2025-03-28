const express = require('express'),
    jwt = require('jsonwebtoken'),
    winston = require("../config/winston"),
    multer = require('multer')

const PedidoModel = require('../models/PedidoModel');



const router = express.Router();
const fs = require("fs");
const { crearError } = require('../utils/errores');


router.post('/', async (req, res) => {
    try {
        const { productos, metodoPago, fechaEntrega, notas, cliente, lugarEntrega } = req.body;

        if (!productos || productos.length === 0) {
            return res.status(400).json({
                code: 400,
                message: "Faltan datos obligatorios: productos es requerido"
            });
        }

        const total = productos.reduce((acc, p) => acc + (p.subtotal || 0), 0);

        const nuevoPedido = new PedidoModel({
            numeroPedido: `PED-${Date.now()}`,
            productos,
            total,
            metodoPago,
            fechaEntrega,
            lugarEntrega,
            notas,
            cliente
        });

        await nuevoPedido.save();

        return res.status(201).json({
            code: 201,
            message: "Pedido creado exitosamente",
            pedido: nuevoPedido
        });

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

//obtener un pedido por id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'ID del pedido no proporcionado' });
        }

        const pedido = await PedidoModel.findById(id);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json(pedido);

    } catch (error) {
        console.error('❌ Error al obtener el pedido:', error);
        res.status(500).json({ message: 'Error al obtener el pedido', error: error.message || error });
    }
});



// //*****************************************************
// //************* FOTOS DE DISEÑO PRODUCCTO *************


const storageImgDiseno = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/diseno');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const partes = file.mimetype.split("/");
        cb(null, uniqueName + "." + partes[1]);
    }
});


const uploadImgDiseno = multer({
    storage: storageImgDiseno,
    fileFilter: (req, file, cb) => {
        const extensiones = ['jpeg', 'jpg', 'png'];
        const partes = file.mimetype.split("/");
        const resultado = extensiones.includes(partes[1]);
        if (resultado) {
            cb(null, true);
        }
        else {
            cb(new Error('Extensión de archivo no permitida'));
        }
    }
});


router.post('/diseno',
    uploadImgDiseno.single('imagenDiseno'),
        async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ message: 'No se cargó la imagen del diseño' });
                }

                return res.json({ message: 'Imagen de diseño cargada exitosamente', filename: req.file.filename });
            } catch (error) {
                console.error('❌ Error al cargar la imagen del diseño:', error);
                res.status(500).json({ message: 'Error al cargar la imagen del diseño', error: error.message || error });
            }
        }
    );


router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'ID del pedido no proporcionado' });
        }

        const pedido = await PedidoModel.findByIdAndDelete(id);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Eliminar la imagen del diseño si existe
        const pathImagen = `./uploads/diseno/${pedido.imagenDiseno}`;
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }

        res.json({ message: 'Pedido eliminado con éxito', pedido });

    } catch (error) {
        console.error('❌ Error al eliminar el pedido:', error);
        res.status(500).json({ message: 'Error al eliminar el pedido', error: error.message || error });
    }
})


module.exports = router;