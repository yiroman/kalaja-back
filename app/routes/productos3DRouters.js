const express = require('express'),
    jwt = require('jsonwebtoken'),
    winston = require("../config/winston"),
    multer = require('multer')


const Producto3DModel = require ('../models/Producto3DModel');
const Venta3D = require ('../models/VentasModel');


const router = express.Router();
const fs = require("fs");
const { crearError, respuestaHTTP} = require('../utils/errores');


router.post('/', async (req, res) => {
    try {
        const data = req.body;

        // Validaciones mínimas (puedes hacer más detalladas si gustas)
        if (!data.nombre || !data.cantidad || data.cantidad <= 0) {
            return res.status(400).json({ error: 'Datos incompletos o inválidos' });
        }

        const nuevaProduccion = new Producto3DModel({
            nombre: data.nombre,
            cantidad: data.cantidad,
            fallidas: data.fallidas || 0,
            regalados: data.regalo || 0,
            stock: data.cantidad || 0,
            gramos: data.gramos,
            precioFilamento: data.precioFilamento,
            horasImpresion: data.horasImpresion,
            horasHombre: data.horasHombre,
            costoExtra: data.costoExtra,
            extras: data.extras,
            precioVenta: data.precioVenta,

            plantillaTecnica: data.plantillaTecnica,

            costoLote: data.costoLote,
            precioCostoPieza: data.precioCostoPieza,
            utilidadPorPieza: data.utilidadPorPieza,
            totalVenta: data.totalVenta,
            utilidadReal: data.utilidadReal,

            operadorId: data.operadorId, // opcional si lo manejas por sesión
        });

        const resultado = await nuevaProduccion.save();
        res.status(201).json(resultado);

    } catch (error) {
        console.error('Error al guardar producción:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});





router.get('/', async (req, res) => {
    try {
        const productos = await Producto3DModel.find({});
        return respuestaHTTP(res, 200, "Lista de productos", productos);
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo obtener los productos: ${e.message}` });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const producto = await Producto3DModel.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ code: 404, message: "Producto no encontrado" });
        }

        const { nombre, descripcion, precio, categoria, imagen, atributosEspecificos, variantes, etiquetas, categorias, subcategorias } = req.body;

        producto.nombre = nombre;
        producto.descripcion = descripcion;
        producto.precio = precio;
        producto.categoria = categoria;
        producto.imagen = imagen;
        producto.atributosEspecificos = atributosEspecificos;
        producto.variantes = variantes;
        producto.labels = etiquetas;
        producto.categorias = categorias;
        producto.subcategorias = subcategorias;


        await producto.save();
        return res.json(producto);
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo actualizar el producto: ${e.message}` });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto3DModel.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ code: 404, message: "Producto no encontrado" });
        }
        return respuestaHTTP(res, 200, "Producto encontrado", producto)
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo obtener el producto: ${e.message}` });
    }
} );

router.delete('/:id', async (req, res) => {
    try {
        const producto = await Producto3DModel.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ code: 404, message: "Producto no encontrado" });
        }
        await producto.remove();
        return res.json({ code: 200, message: "Producto eliminado" });
    } catch (e) {
        return res.status(500).json({ code: 500, message: `No se pudo eliminar el producto: ${e.message}` });
    }
});


router.patch('/:id/fallidas', async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || cantidad <= 0) {
            return res.status(400).json({ error: 'Cantidad inválida' });
        }

        const produccion = await Producto3DModel.findById(id);
        if (!produccion) {
            return res.status(404).json({ error: 'Producción no encontrada' });
        }

        if (produccion.stock < cantidad) {
            return res.status(400).json({ error: 'Stock insuficiente para descontar' });
        }

        // Actualizar valores
        produccion.fallidas += cantidad;
        produccion.stock -= cantidad;
        await produccion.save();

        respuestaHTTP(res, 200, "Lista de productos", produccion)

    } catch (error) {
        console.error('Error al registrar fallidas:', error);
        respuestaHTTP(res, 500, "Error al registrar fallidas", error);
    }
});


router.patch('/:id/regalo', async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || cantidad <= 0) {
            return res.status(400).json({ error: 'Cantidad inválida' });
        }

        const produccion = await Producto3DModel.findById(id);
        if (!produccion) {
            return res.status(404).json({ error: 'Producción no encontrada' });
        }

        if (produccion.stock < cantidad) {
            return res.status(400).json({ error: 'Stock insuficiente para descontar' });
        }

        // Actualizar valores
        produccion.regalados += cantidad;
        produccion.stock -= cantidad;
        await produccion.save();

        respuestaHTTP(res, 200, "Lista de productos", produccion)

    } catch (error) {
        console.error('Error al registrar fallidas:', error);
        respuestaHTTP(res, 500, "Error al registrar fallidas", error);
    }
});


router.patch('/:id/stock', async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || cantidad <= 0) {
            return res.status(400).json({ error: 'Cantidad inválida' });
        }

        const produccion = await Producto3DModel.findById(id);
        if (!produccion) {
            return res.status(404).json({ error: 'Producción no encontrada' });
        }
        // Actualizar valores
        produccion.stock += cantidad;
        await produccion.save();

        respuestaHTTP(res, 200, "Lista de productos", produccion)

    } catch (error) {
        console.error('Error al registrar stock:', error);
        respuestaHTTP(res, 500, "Error al registrar stock", error);
    }
});

router.post('/venta', async (req, res) => {
    const { _id, cantidad, precioVenta } = req.body;

    // 1) Validación básica
    if (!_id || !cantidad || cantidad <= 0 || !precioVenta) {
        return respuestaHTTP(res, 400, "Datos incompletos o inválidos", null);
    }

    // 2) Calcula total
    const total = cantidad * precioVenta;

    let produccion;
    try {
        // 3) Ajusta stock de forma atómica (solo si hay suficiente)
        produccion = await Producto3DModel.findOneAndUpdate(
            { _id: _id, stock: { $gte: cantidad } },
            { $inc: { stock: -cantidad } },
            { new: true, runValidators: true }
        );
        if (!produccion) {
            return respuestaHTTP(res, 400, "Stock insuficiente o producción no encontrada", null);
        }
    } catch (err) {
        console.error('Error ajustando stock:', err);
        return respuestaHTTP(res, 500, "Error al registrar stock", err);
    }

    try {
        // 4) Registra la venta
        const venta = await Venta3D.create({
            produccionId: _id,
            cantidad,
            precioUnitario: precioVenta,
            total
        });
        // 5) Responde con el nuevo estado y el registro de venta
        return respuestaHTTP(res, 200, "Lista de productos", venta);
    } catch (err) {
        console.error('Error al crear venta:', err);
        // 6) (Opcional) Revertir el stock si falla la creación de la venta
        await Producto3DModel.findByIdAndUpdate(
            _id,
            { $inc: { stock: cantidad } }
        );
        return respuestaHTTP(res, 500, "Error al registrar venta", err);
    }
});


module.exports = router;