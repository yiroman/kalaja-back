const express = require('express'),
    jwt = require('jsonwebtoken'),
    winston = require("../config/winston"),
    multer = require('multer')


const Producto3DModel = require ('../models/Producto3DModel');


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



module.exports = router;